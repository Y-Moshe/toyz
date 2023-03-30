import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { Store, select } from '@ngrx/store'
import { ofType, Actions } from '@ngrx/effects'
import { IAppState, actions, selectors } from '@/store'
import { Router } from '@angular/router'
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subscription,
  switchMap,
  take,
} from 'rxjs'
import { AuthService, NotificationService } from '@/services'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup
  isSubmitting$!: Observable<boolean>
  loginSuccessSub!: Subscription
  loginErrorSub!: Subscription

  loginAttemptsLeft = 0
  isLockedOut = false

  constructor(
    private fb: FormBuilder,
    private store$: Store<IAppState>,
    private authService: AuthService,
    private actions$: Actions,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.createDebounceEmailValidator.call(this)],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    })

    this.isSubmitting$ = this.store$.pipe(select(selectors.selectIsSubmitting))

    this.loginSuccessSub = this.actions$
      .pipe(ofType(actions.loginSuccessResponse))
      .subscribe(() => {
        this.router.navigate(['/'])
        this.notificationService.loginSuccess()
      })

    this.loginErrorSub = this.actions$
      .pipe(ofType(actions.loginErrorResponse))
      .subscribe((error) => {
        this.loginForm.enable()
        this.notificationService.loginError(error.message)

        this.loginAttemptsLeft =
          environment.maxLoginAttempts - error.attemptsCount
        this.isLockedOut = error.isLockedOut
      })
  }

  createDebounceEmailValidator() {
    const subject = new BehaviorSubject<string>('')
    const debouncedInput$ = subject.asObservable().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((emailAddress) =>
        this.authService
          .isEMailExists(emailAddress)
          .pipe(map((isExists) => (isExists ? null : { emailNotExists: true })))
      )
    )

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      subject.next(control.value)
      return debouncedInput$.pipe(take(1))
    }
  }

  hasError(fieldName: string, errorName: string) {
    const ctrl = this.loginForm.get(fieldName)
    return ctrl?.touched && ctrl?.hasError(errorName)
  }

  handleSubmit(event: Event) {
    event.preventDefault()
    if (this.loginForm.invalid) return
    this.loginForm.disable()

    const credintials = { ...this.loginForm.value }
    this.store$.dispatch(actions.login(credintials))
  }

  handleDemoLogin(event: Event) {
    this.loginForm.setValue({
      email: 'moshe@gmail.com',
      password: 'Pa$$w0rd',
    })

    this.handleSubmit(event)
  }

  ngOnDestroy(): void {
    this.loginSuccessSub.unsubscribe()
    this.loginErrorSub.unsubscribe()
  }
}
