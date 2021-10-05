using System;
using Domain.Enums;

namespace Domain.Utilities
{
    public class ResponseException:Exception
    {
        public ExceptionType Type { get; set; }

        public string PropertyName;
        public ResponseException()
        {
            
        }
        public ResponseException(ExceptionType exceptionType, string message)
            : base(message)
        {
            Type = exceptionType;
        }
        public ResponseException(ExceptionType exceptionType, string message,string propertyName)
            : base(message)
        {
            Type = exceptionType;
            PropertyName = propertyName;
            
        }
     
    }
}