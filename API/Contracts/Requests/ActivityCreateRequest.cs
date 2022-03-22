namespace Api.Contracts.Requests;

public class ActivityCreateRequest
{
    public string Name{ get; set; }
    public int ModuleId { get; set; }
    public string Description { get; set; }
    public bool Active { get; set; }
}
