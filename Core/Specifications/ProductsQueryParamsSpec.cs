namespace Core.Specifications;

public class ProductsQueryParamsSpec
{
    private const int MaxPageSize = 50;
    public int PageIndex { get; set; } = 1;

    private int _pageSize = 6;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize ? MaxPageSize : value);
    }

    public string BrandIds { get; set; }
    private int? _categoryId;
    public int? CategoryId
    {
        get => this._categoryId;
        set => _categoryId = (value == 0 ? null : value);
    }
    public string Sort { get; set; }

    private string _search;
    public string Search
    {
        get => _search;
        set => _search = (value ?? "").ToLower();
    }
}
