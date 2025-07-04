using System.ComponentModel.DataAnnotations;

namespace ReactCrmApp.Shared.Models;

public class ApplicationUserWithRolesDto : ApplicationUserDto
{
    public List<string>? Roles { get; set; }
}
