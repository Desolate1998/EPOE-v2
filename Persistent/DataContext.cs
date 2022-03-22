using Domain.Enums;
using Domain.Models.Database;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace Persistent
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions opt) : base(opt)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(x => x.UserType)
                .HasConversion(x => x.ToString(), x => (UserTypes)Enum.Parse(typeof(UserTypes), x));
                entity.HasMany(x => x.Logins).WithOne(x => x.User);
            });



            modelBuilder.Entity<Qualification>(entity =>
            {
                entity.HasOne(x => x.NqfLevel)
                      .WithMany(x => x.Qualifications)
                      .HasForeignKey(x => x.NqfLevelId)
                        .OnDelete(DeleteBehavior.NoAction);

                entity.HasMany(x => x.Modules)
                    .WithOne(x => x.Qualification)
                    .OnDelete(DeleteBehavior.NoAction);

            });

            modelBuilder.Entity<NqfLevel>(entity =>
            {
                entity.HasMany(x => x.Qualifications)
                      .WithOne(x => x.NqfLevel)
                      .OnDelete(DeleteBehavior.NoAction);
            });


            modelBuilder.Entity<Module>(entity =>
            {
                entity.HasOne(x => x.Qualification)
                    .WithMany(x => x.Modules)
                    .HasForeignKey(x => x.QualificationId)
                    .OnDelete(DeleteBehavior.NoAction);
                entity.HasMany(x => x.Activities)
                    .WithOne(x => x.Module)
                    .OnDelete(DeleteBehavior.NoAction); ;
            });

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasOne(x => x.Module)
                    .WithMany(x => x.Activities)
                    .HasForeignKey(x => x.ModuleId)
                    .OnDelete(DeleteBehavior.NoAction);
            });


            modelBuilder.Entity<Campus>(entity =>
            {

            });


            modelBuilder.Entity<LoginLog>(entity =>
            {
                entity.HasOne(x => x.User).WithMany(x => x.Logins).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<File>(entity =>
            {
                entity.HasOne(x => x.Uploader).WithMany(x => x.Files).HasForeignKey(x => x.UploaderId).OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<ProfileDocumentType>(entity =>
            {
                entity.HasMany(x => x.ProfileDocuments).WithOne(x => x.ProfileDocumentType).HasForeignKey(x => x.ProfileDocumentTypeId).OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<ProfileDocument>(entity =>
            {
                entity.HasOne(x => x.ProfileDocumentType).WithMany(x => x.ProfileDocuments).HasForeignKey(x => x.ProfileDocumentTypeId).OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(x => x.File).WithMany().HasForeignKey(x => x.FileId).OnDelete(DeleteBehavior.NoAction);
            });
            modelBuilder.Entity<ExtraDocumentType>(entity => {
                entity.HasMany(x => x.ExtraDocuments).WithOne(x => x.ExtraDocumentType).HasForeignKey(x => x.ExtraDocumentId).OnDelete(DeleteBehavior.Cascade);

            });
            modelBuilder.Entity<ExtraDocument>(entity => {
                entity.HasOne(x => x.ExtraDocumentType).WithMany(x => x.ExtraDocuments).HasForeignKey(x => x.ExtraDocumentId).OnDelete(DeleteBehavior.NoAction);
                entity.HasOne(x => x.File).WithMany().HasForeignKey(x => x.FileId).OnDelete(DeleteBehavior.NoAction);
            });

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Qualification> Qualifications { get; set; }
        public DbSet<NqfLevel> NqfLevels { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Activity> Activities { get; set; }

        public DbSet<Campus> Campuses { get; set; }
        public DbSet<LoginLog> Logins { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<ProfileDocumentType> ProfileDocumentTypes { get; set; }
        public DbSet<ProfileDocument> ProfileDocuments { get; set; }
        public DbSet<ExtraDocumentType> ExtraDocumentTypes { get; set; }
        public DbSet<ExtraDocumentType> ExtraDocuments { get; set; }


    }
}
