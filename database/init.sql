-- 1. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Tours Table
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_location VARCHAR(100) NOT NULL,
    end_location VARCHAR(100) NOT NULL,
    transport_type VARCHAR(20) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,
    estimated_time INT NOT NULL, -- in seconds
    map_image_path VARCHAR(255),
    route_geojson JSONB,
    computed_popularity_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    computed_child_friendly_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 3. Create Tour Logs Table
CREATE TABLE tour_logs (
    id SERIAL PRIMARY KEY,
    tour_id INT NOT NULL,
    log_date_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    difficulty INT NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    total_distance DECIMAL(10, 2) NOT NULL,
    total_time INT NOT NULL, -- in seconds
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    weather_condition VARCHAR(50),
    temperature DECIMAL(5, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraints
    CONSTRAINT fk_tour
        FOREIGN KEY (tour_id) 
        REFERENCES tours(id)
        ON DELETE CASCADE
);