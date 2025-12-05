CREATE TABLE AppUser (
    UserId INT IDENTITY PRIMARY KEY,
    Username NVARCHAR(100) UNIQUE NOT NULL,
    DisplayName NVARCHAR(200),
    Email NVARCHAR(255),
    PasswordHash NVARCHAR(255),
    Role NVARCHAR(50)
);

CREATE TABLE Advisor (
    AdvisorId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    Department NVARCHAR(200),
    OfficeLocation NVARCHAR(200),
    FOREIGN KEY (UserId) REFERENCES AppUser(UserId)
);

CREATE TABLE Student (
    StudentId INT IDENTITY PRIMARY KEY,
    UserId INT NOT NULL,
    StudentNumber NVARCHAR(50),
    Major NVARCHAR(200),
    PrimaryAdvisorId INT NULL,
    FOREIGN KEY (UserId) REFERENCES AppUser(UserId),
    FOREIGN KEY (PrimaryAdvisorId) REFERENCES Advisor(AdvisorId)
);

CREATE TABLE School (
    SchoolId INT IDENTITY PRIMARY KEY,
    SchoolName NVARCHAR(200)
);

CREATE TABLE Department (
    DepartmentId INT IDENTITY PRIMARY KEY,
    SchoolId INT NOT NULL,
    DepartmentName NVARCHAR(200),
    FOREIGN KEY (SchoolId) REFERENCES School(SchoolId)
);

CREATE TABLE Course (
    CourseId INT IDENTITY PRIMARY KEY,
    DepartmentId INT NOT NULL,
    CourseCode NVARCHAR(50),
    CourseName NVARCHAR(200),
    CourseLevel INT,
    CreditHours INT,
    FOREIGN KEY (DepartmentId) REFERENCES Department(DepartmentId)
);

CREATE TABLE CourseSection (
    SectionId INT IDENTITY PRIMARY KEY,
    CourseId INT NOT NULL,
    InstructorId INT NOT NULL,
    Term NVARCHAR(50),
    Location NVARCHAR(200),
    MeetingDays NVARCHAR(20),
    StartTime TIME,
    EndTime TIME,
    Capacity INT,
    FOREIGN KEY (CourseId) REFERENCES Course(CourseId),
    FOREIGN KEY (InstructorId) REFERENCES Advisor(AdvisorId)
);

CREATE TABLE Enrollment (
    EnrollmentId INT IDENTITY PRIMARY KEY,
    SectionId INT NOT NULL,
    StudentId INT NOT NULL,
    Grade NVARCHAR(10),
    FOREIGN KEY (SectionId) REFERENCES CourseSection(SectionId),
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId)
);

CREATE TABLE AppointmentStatus (
    StatusCode NVARCHAR(50) PRIMARY KEY,
    DisplayName NVARCHAR(200)
);

CREATE TABLE Appointment (
    AppointmentId INT IDENTITY PRIMARY KEY,
    StudentId INT NOT NULL,
    AdvisorId INT NOT NULL,
    StartTimeUtc DATETIME2,
    EndTimeUtc DATETIME2,
    StatusCode NVARCHAR(50),
    Notes NVARCHAR(MAX),
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId),
    FOREIGN KEY (AdvisorId) REFERENCES Advisor(AdvisorId),
    FOREIGN KEY (StatusCode) REFERENCES AppointmentStatus(StatusCode)
);
