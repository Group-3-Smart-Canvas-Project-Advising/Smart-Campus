INSERT INTO AppointmentStatus (StatusCode, DisplayName)
VALUES ('SCHEDULED', 'Scheduled'),
       ('CONFIRMED', 'Confirmed'),
       ('COMPLETED', 'Completed'),
       ('CANCELLED', 'Cancelled');

INSERT INTO School (SchoolName)
VALUES ('Engineering'),
       ('Arts & Sciences'),
       ('Business');

INSERT INTO Department (SchoolId, DepartmentName)
VALUES (1, 'Computer Science'),
       (1, 'Data Science'),
       (2, 'Mathematics'),
       (3, 'Management');

EXEC CreateAdvisorUser 'advisor1', 'password123', 'Advisor One', 'adv1@example.com', 'Computer Science', 'Office A';
EXEC CreateAdvisorUser 'advisor2', 'password123', 'Advisor Two', 'adv2@example.com', 'Mathematics', 'Office B';

EXEC CreateStudentUser 'student1', 'password123', 'Student One', 'stu1@example.com', 'S000001', 'Computer Science';
EXEC CreateStudentUser 'student2', 'password123', 'Student Two', 'stu2@example.com', 'S000002', 'Data Science';

UPDATE Student SET PrimaryAdvisorId = 1 WHERE StudentId = 1;
UPDATE Student SET PrimaryAdvisorId = 2 WHERE StudentId = 2;

INSERT INTO Course (DepartmentId, CourseCode, CourseName, CourseLevel, CreditHours)
VALUES (1, 'CS 1013', 'Intro to Programming', 1000, 3),
       (2, 'DS 2013', 'Machine Learning I', 2000, 3),
       (3, 'MATH 2144', 'Calculus I', 2000, 4);

INSERT INTO CourseSection (CourseId, InstructorId, Term, Location, MeetingDays, StartTime, EndTime, Capacity)
VALUES (1, 1, 'Fall 2025', 'Main Campus', 'MWF', '09:00', '09:50', 35),
       (2, 2, 'Fall 2025', 'Main Campus', 'TR', '11:00', '12:15', 40);

INSERT INTO Enrollment (SectionId, StudentId)
VALUES (1, 1),
       (2, 2);

INSERT INTO Appointment (StudentId, AdvisorId, StartTimeUtc, EndTimeUtc, StatusCode, Notes)
VALUES (1, 1, GETDATE(), DATEADD(HOUR,1,GETDATE()), 'SCHEDULED', ''),
       (2, 2, GETDATE(), DATEADD(HOUR,1,GETDATE()), 'CONFIRMED', '');
