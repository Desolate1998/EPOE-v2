using System.ComponentModel;

namespace Domain.Enums
{
    public enum ExceptionType
    {
        [Description("The requested resources was not found")]
        NotFound,
        [Description("User is not allowed to access this method")]
        NotAllowed,
        [Description("User input data was not valid")]
        InputNotValid
        
        
    }
}