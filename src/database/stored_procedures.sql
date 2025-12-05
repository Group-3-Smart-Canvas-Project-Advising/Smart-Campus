CREATE OR ALTER PROCEDURE CreateAdvisorUser
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @DisplayName NVARCHAR(200),
    @Email NVARCHAR(255),
    @Department NVARCHAR(200),
    @OfficeLocation NVARCHAR(200)
AS
BEGIN
    INSERT INTO AppUser (Username, PasswordHash, DisplayName, Email, Role)
    VALUES (@Username, @PasswordHash, @DisplayName, @Email, 'Advisor');

    DECLARE @UserId INT = SCOPE_IDENTITY();

    INSERT INTO Advisor (UserId, Department, OfficeLocation)
    VALUES (@UserId, @Department, @OfficeLocation);

    SELECT @UserId AS UserId;
END;
GO

CREATE OR ALTER PROCEDURE CreateStudentUser
    @Username NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @DisplayName NVARCHAR(200),
    @Email NVARCHAR(255),
    @StudentNumber NVARCHAR(50),
    @Major NVARCHAR(200)
AS
BEGIN
    INSERT INTO AppUser (Username, PasswordHash, DisplayName, Email, Role)
    VALUES (@Username, @PasswordHash, @DisplayName, @Email, 'Student');

    DECLARE @UserId INT = SCOPE_IDENTITY();

    INSERT INTO Student (UserId, StudentNumber, Major)
    VALUES (@UserId, @StudentNumber, @Major);

    SELECT @UserId AS UserId;
END;
GO

CREATE OR ALTER PROCEDURE GetStudentSchedule
    @StudentUserId INT,
    @Term NVARCHAR(20) = NULL
AS
BEGIN
    DECLARE @StudentId INT =
    (
        SELECT StudentId FROM Student WHERE UserId = @StudentUserId
    );

    SELECT
        e.EnrollmentId,
        e.SectionId,
        c.CourseCode,
        c.CourseName,
        cs.Term,
        cs.Location,
        cs.MeetingDays,
        cs.StartTime,
        cs.EndTime,
        au.DisplayName AS InstructorName,
        e.Grade
    FROM Enrollment e
    JOIN CourseSection cs ON e.SectionId = cs.SectionId
    JOIN Course c ON cs.CourseId = c.CourseId
    JOIN Advisor a ON cs.InstructorId = a.AdvisorId
    JOIN AppUser au ON a.UserId = au.UserId
    WHERE e.StudentId = @StudentId
      AND (@Term IS NULL OR cs.Term = @Term)
    ORDER BY cs.Term, c.CourseCode;
END;
GO

CREATE OR ALTER PROCEDURE GetAdvisorStudents
    @AdvisorId INT
AS
BEGIN
    SELECT
        s.StudentId,
        u.DisplayName AS StudentName,
        s.Major
    FROM Student s
    JOIN AppUser u ON s.UserId = u.UserId
    WHERE s.PrimaryAdvisorId = @AdvisorId;
END;
GO

CREATE OR ALTER PROCEDURE GetAdvisorUpcomingAppointments
    @AdvisorId INT
AS
BEGIN
    SELECT
        ap.AppointmentId,
        ap.StartTimeUtc,
        ap.EndTimeUtc,
        ap.StatusCode,
        u.DisplayName AS StudentName
    FROM Appointment ap
    JOIN Student s ON ap.StudentId = s.StudentId
    JOIN AppUser u ON s.UserId = u.UserId
    WHERE ap.AdvisorId = @AdvisorId
    ORDER BY ap.StartTimeUtc;
END;
GO

CREATE OR ALTER PROCEDURE GetCourseRoster
    @SectionId INT
AS
BEGIN
    SELECT
        e.EnrollmentId,
        s.StudentId,
        u.DisplayName AS StudentName,
        e.Grade
    FROM Enrollment e
    JOIN Student s ON e.StudentId = s.StudentId
    JOIN AppUser u ON s.UserId = u.UserId
    WHERE e.SectionId = @SectionId;
END;
GO
