namespace Api.Contracts.Requests
{
    public class QualificationCreateRequest
    {
        public string Name { get; set; }
        public int NqfLevelId { get; set; }
        public string Description { get; set; }

    }
}
