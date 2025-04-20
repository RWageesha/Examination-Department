// JavaScript for Exam Results functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('login-section');
    const resultsSection = document.getElementById('results-section');
    const semesterSelect = document.getElementById('semesterSelect');
    const resultsTableContainer = document.getElementById('results-table-container');
    const studentNameElement = document.getElementById('studentName');
    const studentRegElement = document.getElementById('studentReg').querySelector('span');
    const studentFacultyElement = document.getElementById('studentFaculty').querySelector('span');
    const studentDegreeElement = document.getElementById('studentDegree').querySelector('span');
    const semesterGPAElement = document.getElementById('semesterGPA');
    const overallGPAElement = document.getElementById('overallGPA');
    const printResultsBtn = document.getElementById('printResults');
    const backToLoginBtn = document.getElementById('backToLogin');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordField = document.getElementById('password');

    // Sample student data (in a real application, this would come from a database)
    const studentData = {
        'D/BCS/23/0019': {
            password: 'password123',
            name: 'W W Rajapaksha',
            faculty: 'Faculty of Engineering',
            degree: 'BSc in Computer Engineering',
            results: {
                'Semester 1': {
                    subjects: [
                        { code: 'ENG1001', name: 'Introduction to Engineering', credits: 3, grade: 'A' },
                        { code: 'MATH1101', name: 'Engineering Mathematics I', credits: 4, grade: 'A-' },
                        { code: 'PHYS1201', name: 'Engineering Physics', credits: 3, grade: 'B+' },
                        { code: 'ENG1102', name: 'Engineering Drawing', credits: 2, grade: 'A' },
                        { code: 'ENG1103', name: 'Technical Communication', credits: 2, grade: 'B' }
                    ],
                    semesterGPA: 3.75,
                    overallGPA: 3.75
                },
                'Semester 2': {
                    subjects: [
                        { code: 'COMP1001', name: 'Computer Programming', credits: 3, grade: 'A' },
                        { code: 'MATH1102', name: 'Engineering Mathematics II', credits: 4, grade: 'B+' },
                        { code: 'ENG1201', name: 'Electrical Engineering', credits: 3, grade: 'A-' },
                        { code: 'ENG1202', name: 'Electronics', credits: 3, grade: 'B' },
                        { code: 'GEN1001', name: 'Critical Thinking', credits: 2, grade: 'A' }
                    ],
                    semesterGPA: 3.67,
                    overallGPA: 3.71
                },
                'Semester 3': {
                    subjects: [
                        { code: 'COMP2001', name: 'Data Structures and Algorithms', credits: 3, grade: 'A-' },
                        { code: 'COMP2002', name: 'Object-Oriented Programming', credits: 3, grade: 'A' },
                        { code: 'ENG2101', name: 'Digital Systems', credits: 3, grade: 'B+' },
                        { code: 'MATH2101', name: 'Probability and Statistics', credits: 3, grade: 'B' },
                        { code: 'GEN2001', name: 'Professional Ethics', credits: 2, grade: 'A' }
                    ],
                    semesterGPA: 3.65,
                    overallGPA: 3.69
                }
            }
        },
        'KDU54321': {
            password: 'password456',
            name: 'Sarah Jayasinghe',
            faculty: 'Faculty of Computing',
            degree: 'BSc in Software Engineering',
            results: {
                'Semester 1': {
                    subjects: [
                        { code: 'CS1001', name: 'Introduction to Computing', credits: 3, grade: 'A' },
                        { code: 'CS1002', name: 'Programming Fundamentals', credits: 4, grade: 'A' },
                        { code: 'MATH1001', name: 'Discrete Mathematics', credits: 3, grade: 'A-' },
                        { code: 'CS1003', name: 'Computer Systems', credits: 3, grade: 'B+' },
                        { code: 'GEN1001', name: 'Academic Writing', credits: 2, grade: 'A' }
                    ],
                    semesterGPA: 3.87,
                    overallGPA: 3.87
                },
                'Semester 2': {
                    subjects: [
                        { code: 'CS1004', name: 'Object-Oriented Programming', credits: 3, grade: 'A-' },
                        { code: 'CS1005', name: 'Database Systems', credits: 3, grade: 'B+' },
                        { code: 'CS1006', name: 'Web Development', credits: 3, grade: 'A' },
                        { code: 'MATH1002', name: 'Statistics', credits: 3, grade: 'B' },
                        { code: 'GEN1002', name: 'Communication Skills', credits: 2, grade: 'A' }
                    ],
                    semesterGPA: 3.60,
                    overallGPA: 3.74
                }
            }
        }
    };

    // Function to load data from Excel file (normally you would fetch this from a server)
    function loadDataFromExcel(callback) {
        // In a real application, you would fetch the Excel file from a server
        // For this example, we'll use the sample data above
        callback(studentData);
        
        /* This is how you would handle real Excel files:
        
        // Fetch the Excel file
        fetch('path/to/results.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                // Parse Excel file
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Process the workbook data to match your data structure
                const processedData = processExcelData(workbook);
                
                // Execute callback with processed data
                callback(processedData);
            })
            .catch(error => {
                console.error('Error loading Excel file:', error);
                alert('Error loading student data. Please try again later.');
            });
        */
    }

    // Function to process Excel data (for real implementation)
    function processExcelData(workbook) {
        const result = {};
        
        // Get the student info sheet
        const studentSheet = workbook.Sheets['StudentInfo'];
        const students = XLSX.utils.sheet_to_json(studentSheet);
        
        // Process each student
        students.forEach(student => {
            const regNumber = student.RegistrationNumber;
            result[regNumber] = {
                password: student.Password,
                name: student.Name,
                faculty: student.Faculty,
                degree: student.Degree,
                results: {}
            };
            
            // Process results for each semester
            const semesterSheets = workbook.SheetNames.filter(name => 
                name.startsWith(regNumber) && name.includes('Semester'));
                
            semesterSheets.forEach(sheetName => {
                const semesterSheet = workbook.Sheets[sheetName];
                const semesterData = XLSX.utils.sheet_to_json(semesterSheet);
                const semesterNumber = sheetName.split('Semester')[1].trim();
                
                const subjects = semesterData.filter(row => row.Code && row.Subject);
                const summary = semesterData.find(row => row.SemesterGPA);
                
                result[regNumber].results[`Semester ${semesterNumber}`] = {
                    subjects: subjects.map(subj => ({
                        code: subj.Code,
                        name: subj.Subject,
                        credits: subj.Credits,
                        grade: subj.Grade
                    })),
                    semesterGPA: summary ? summary.SemesterGPA : 0,
                    overallGPA: summary ? summary.OverallGPA : 0
                };
            });
        });
        
        return result;
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const regNumber = document.getElementById('regNumber').value;
        const password = document.getElementById('password').value;
        
        // Load data from Excel (or in this case, our sample data)
        loadDataFromExcel(function(data) {
            // Validate login
            if (data[regNumber] && data[regNumber].password === password) {
                // Show student data
                displayStudentData(regNumber, data[regNumber]);
                
                // Switch from login to results section
                loginSection.style.display = 'none';
                resultsSection.style.display = 'block';
            } else {
                alert('Invalid registration number or password. Please try again.');
            }
        });
    });
    
    // Toggle password visibility
    passwordToggle.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        
        // Change the eye icon
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
    
    // Display student data function
    function displayStudentData(regNumber, studentData) {
        // Set student information
        studentNameElement.textContent = studentData.name;
        studentRegElement.textContent = regNumber;
        studentFacultyElement.textContent = studentData.faculty;
        studentDegreeElement.textContent = studentData.degree;
        
        // Clear and populate semester dropdown
        semesterSelect.innerHTML = '';
        Object.keys(studentData.results).forEach(semester => {
            const option = document.createElement('option');
            option.value = semester;
            option.textContent = semester;
            semesterSelect.appendChild(option);
        });
        
        // Display results for first semester by default
        const firstSemester = Object.keys(studentData.results)[0];
        displaySemesterResults(studentData.results[firstSemester]);
        
        // Add event listener for semester change
        semesterSelect.addEventListener('change', function() {
            const selectedSemester = this.value;
            displaySemesterResults(studentData.results[selectedSemester]);
        });
    }
    
    // Display semester results function
    function displaySemesterResults(semesterData) {
        // Create results table
        const tableHTML = `
            <table class="results-table animate-fade">
                <thead>
                    <tr>
                        <th>Subject Code</th>
                        <th>Subject</th>
                        <th>Credits</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${semesterData.subjects.map(subject => `
                        <tr>
                            <td class="subject-code">${subject.code}</td>
                            <td>${subject.name}</td>
                            <td>${subject.credits}</td>
                            <td class="grade ${subject.grade}">${subject.grade}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Update the table container
        resultsTableContainer.innerHTML = tableHTML;
        
        // Update GPA display
        semesterGPAElement.textContent = semesterData.semesterGPA.toFixed(2);
        overallGPAElement.textContent = semesterData.overallGPA.toFixed(2);
    }
    
    // Handle back to login button
    backToLoginBtn.addEventListener('click', function() {
        // Clear form
        loginForm.reset();
        
        // Switch back to login section
        resultsSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
    
    // Handle print button
    printResultsBtn.addEventListener('click', function() {
        // Add a logo for printing
        const printLogo = document.createElement('div');
        printLogo.className = 'print-kdu-logo';
        printLogo.style.display = 'none'; // Hidden on screen
        printLogo.innerHTML = '<img src="./assets/images/Main-logo.png" alt="KDU Logo" style="height: 80px;">';
        
        // Add to body before printing
        document.body.prepend(printLogo);
        
        // Print the document
        window.print();
        
        // Remove the print logo after printing
        setTimeout(() => {
            printLogo.remove();
        }, 100);
    });
});