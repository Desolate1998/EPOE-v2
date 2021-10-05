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
            CreateMap<LoginRequest, User>();

        }
    }
}
