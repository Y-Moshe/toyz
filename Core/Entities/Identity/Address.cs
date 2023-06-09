using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Core.Entities.Identity;

public class Address : BaseEntity
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    public string Street { get; set; }
    [Required]
    public string City { get; set; }
    [Required]
    public string State { get; set; }
    [Required]
    public string ZipCode { get; set; }

    [Required]
    [JsonIgnore]
    public string AppUserId { get; set; }
    [JsonIgnore]
    public AppUser AppUser { get; set; }
}
