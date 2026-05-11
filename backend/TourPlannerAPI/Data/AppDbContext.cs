using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TourPlannerAPI.Models;

namespace TourPlannerAPI.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Tour> Tours { get; set; }

    public virtual DbSet<TourLog> TourLogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tour>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tours_pkey");

            entity.ToTable("tours");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ComputedChildFriendlyScore)
                .HasPrecision(5, 2)
                .HasColumnName("computed_child_friendly_score");
            entity.Property(e => e.ComputedPopularityScore)
                .HasPrecision(5, 2)
                .HasColumnName("computed_popularity_score");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Distance)
                .HasPrecision(10, 2)
                .HasColumnName("distance");
            entity.Property(e => e.EndLocation)
                .HasMaxLength(100)
                .HasColumnName("end_location");
            entity.Property(e => e.EstimatedTime).HasColumnName("estimated_time");
            entity.Property(e => e.MapImagePath)
                .HasMaxLength(255)
                .HasColumnName("map_image_path");
            entity.Property(e => e.RouteGeojson)
                .HasColumnType("jsonb")
                .HasColumnName("route_geojson");
            entity.Property(e => e.StartLocation)
                .HasMaxLength(100)
                .HasColumnName("start_location");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .HasColumnName("title");
            entity.Property(e => e.TransportType)
                .HasMaxLength(20)
                .HasColumnName("transport_type");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Tours)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user");
        });

        modelBuilder.Entity<TourLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tour_logs_pkey");

            entity.ToTable("tour_logs");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Difficulty).HasColumnName("difficulty");
            entity.Property(e => e.LogDateTime)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("log_date_time");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Temperature)
                .HasPrecision(5, 2)
                .HasColumnName("temperature");
            entity.Property(e => e.TotalDistance)
                .HasPrecision(10, 2)
                .HasColumnName("total_distance");
            entity.Property(e => e.TotalTime).HasColumnName("total_time");
            entity.Property(e => e.TourId).HasColumnName("tour_id");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.WeatherCondition)
                .HasMaxLength(50)
                .HasColumnName("weather_condition");

            entity.HasOne(d => d.Tour).WithMany(p => p.TourLogs)
                .HasForeignKey(d => d.TourId)
                .HasConstraintName("fk_tour");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "users_username_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
