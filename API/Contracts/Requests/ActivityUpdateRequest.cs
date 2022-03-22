namespace Api.Contracts.Requests;

public class ActivityUpdateRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
    public bool Active { get; set; }
}