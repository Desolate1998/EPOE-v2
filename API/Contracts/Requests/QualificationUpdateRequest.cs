namespace Api.Contracts.Requests
{
    public class QualificationUpdateRequest
    {
        public string Name { get; set; }
        public int NqfLevelId { get; set; }
        public bool Active { get; set; }
        public string Description { get; set; }


    }
}
