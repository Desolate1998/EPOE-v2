using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Contracts.Requests;
using AutoMapper;
using Domain.Models.Database;

namespace Api.Extensions
{
    public class MapperProfilesExtension : Profile
    {
        public MapperProfilesExtension()
        {
            CreateMap<UserCreateRequest, User>();
            CreateMap<RegisterRequest, User>();
            CreateMap<NqfLevelCreateRequest, NqfLevel>();
            CreateMap<QualificationCreateRequest, Qualification>();
            CreateMap<ModuleCreateRequest, Module>();
            CreateMap<ActivityCreateRequest, Activity>();
            CreateMap<CampusCreateRequest, Campus>();
            CreateMap<ProfileDocumentTypeCreateRequest, ProfileDocumentType>();
        }
    }
}
