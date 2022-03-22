namespace Api.Contracts.Requests
{
    public class ModuleCreateRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }    
        public int QualificationId { get; set; }   
    }
}
