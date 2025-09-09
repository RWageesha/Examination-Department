<?php
session_start(); ?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors">
    <meta name="generator" content="Hugo 0.108.0">
    <link rel="icon" type="image/x-icon" href="../assets/dist/img/kdu_logo.png">
    <title>KDU Online Registration</title>

    <link rel="canonical" href="https://getbootstrap.com/docs/5.3/examples/navbar-static/">

    <?php include '../common/common.php' ?>

    <style>
    .form-check-input:disabled + .form-check-label {
        color: #6c757d;
        cursor: not-allowed;
        opacity: 0.7;
    }

    input[type="number"].form-control {
        width: 100px !important;  /* Adjust width as needed */
        text-align: center;
        padding: 0.375rem 0.5rem;
    }

    #detailed_degree_certificate_no_of_copies,
    #transcript_no_of_copies {
        max-width: 100px;
    }

    .card-header.bg-primary {
    padding: 0.75rem 1.25rem;
    }

    .cart-container {
    width: 100%;
    }

    .cart-items {
        margin-bottom: 1rem;
    }

    .cart-item {
        margin-bottom: 1rem;
    }

    .item-name {
        font-weight: 500;
        margin-bottom: 0.25rem;
    }

    .item-details {
        display: flex;
        justify-content: space-between;
        padding-left: 1rem;
    }

    .item-price {
        text-align: right;
        white-space: nowrap;
    }

    .cart-total {
        font-size: 1.1rem;
    }

    input[type=number]::-webkit-inner-spin-button {
        opacity: 1;
        margin: 0;
    }
     
    .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    @media (min-width: 768px) {
        .bd-placeholder-img-lg {
            font-size: 3.5rem;
        }
    }

    .b-example-divider {
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
    }

    .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
    }

    .bi {
        vertical-align: -.125em;
        fill: currentColor;
    }

    .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
    }

    .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
    }

    /* Make the dropdown height match the input and restrict width */
    .country-code-select {
        max-width: 90px;         /* Controls the width of the dropdown */
        min-width: 80px;
        padding: 0.375rem 0.75rem;
        border: 1px solid #ced4da;
        border-right: none;
        /*border-radius: 0.25rem 0 0 0.25rem; /* rounded left corners */
        height: 100%;            /* Ensures it fills the input height */
        appearance: auto;        /* Ensures native dropdown behavior */
    }

    
    </style>


    <!-- Custom styles for this template -->
    <link href="../assets/dist/css/main.css" rel="stylesheet">
    <script type="text/javascript" charset="utf8" src="../assets/dist/js/blockui.js"></script>

</head>

<body>

    <nav class="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">KDU Online Registration</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

        </div>
    </nav>

    <main class="container">
        <div class="p-5 rounded">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <h5 class="card-header">
                            Application for a Detailed Degree Certificate/Transcript
                        </h5>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-12">
                                    <form class="needs-validation" novalidate id="degree-transcript-submit-form"
                                        enctype="multipart/form-data">

                                        <h2>Student Information (Part 1)</h2>

                                        <div class="row">
                                            <div class="col-md-4">
                                                <label for="validationCustom01">Category</label>
                                                <select class="form-select" aria-label="Default select example"
                                                    id="student_category" name="student_category">
                                                    <option value="1">Postgraduate</option>
                                                    <option value="2">Undergraduate</option>
                                                </select>
                                            </div>
                                            <div class="col-md-5">
                                                <label for="validationCustom01">Student Type</label>
                                                <select class="form-select" aria-label="Default select example"
                                                    id="student_type" name="student_type">
                                                    <!--<option value="Cadet(Local)">Cadet(Local)</option>
                                                    <option value="Cadet(Foreign)">Cadet(Foreign)</option>
                                                    <option value="Day Scholar(Local)">Day Scholar(Local)</option>
                                                    <option value="Day Scholar(Foreign)">Day Scholar(Foreign)</option>
                                                    <option value="Service Officers(Military)">Service Officers(Military)</option>
                                                    <option value="Service Officers(Police)">Service Officers(Police)</option>
                                                    <option value="Other">Other</option>-->
                                                </select>
                                            </div>
                                            <!--<div class="col-md-2">
                                                <label for="validationCustom01">Other Category</label>
                                                <input type="text" class="form-control" id="other_category" name="other_category" placeholder="Other Category">
                                                <div class="invalid-feedback">
                                                    Please choose a category.
                                                </div>
                                            </>-->
                                        </div>


                                        <hr>

                                        <h2>Type Of Certificate</h2>
                                        <div class="row">  <!-- New wrapper row -->
                                            <div class="col-md-8">
                                                <div class="row mt-1">
                                                    <div class="col-md-4">
                                                        <div class="form-group mt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox"
                                                                    id="detailed_degree_certificate"
                                                                    name="detailed_degree_certificate">
                                                                <label class="form-check-label" for="flexCheckDefault">
                                                                    Detailed Degree Certificate(Transcript Without Marks)
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row mt-1">
                                                    <div class="col-md-4">
                                                        <div class="form-group mt-2">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox"
                                                                    id="is_second_copy_of_detailed_degree_certificate"
                                                                    name="is_second_copy_of_detailed_degree_certificate">
                                                                <label class="form-check-label" for="flexCheckChecked">
                                                                    Certified Copies Of Detailed Degree Certificate(Transcript Without Marks)
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="col-md-3 mt-1">
                                                        <div class="form-group">
                                                            <input type="number" class="form-control"
                                                                id="detailed_degree_certificate_no_of_copies"
                                                                name="detailed_degree_certificate_no_of_copies"
                                                                placeholder="No Of Copies" value="0">
                                                            <div class="invalid-feedback">
                                                                Please choose number of copies.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row mt-1">
                                                <div class="col-md-4">
                                                    <div class="form-group mt-2">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="transcript"
                                                                name="transcript">
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                Transcript With Marks
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 mt-1">
                                                    <div class="form-group">
                                                        <input type="number" class="form-control"
                                                            id="transcript_no_of_copies" name="transcript_no_of_copies"
                                                            placeholder="No Of Copies" value="0">
                                                        <div class="invalid-feedback">
                                                            Please choose number of copies.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row mt-1">
                                                <div class="col-md-5">
                                                    <div class="form-group mt-2">
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox"
                                                                id="is_second_copy_of_detailed_degree_certificate_already_issued"
                                                                name="is_second_copy_of_detailed_degree_certificate_already_issued">
                                                            <label class="form-check-label" for="flexCheckChecked">
                                                                If lost/damaged, Second Copy Of Detailed Degree Certificate
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--                                         <div class="row mt-1">
                                            <div class="col-md-4">
                                                <div class="form-group mt-2">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox"
                                                            id="verification_of_certificate"
                                                            name="verification_of_certificate">
                                                        <label class="form-check-label" for="flexCheckChecked">
                                                            Vertification Of Certificate
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> -->

                                        <!-- Cart Sidebar - Now positioned next to the certificate options-->
                                        <div class="col-md-4">
                                            <div class="card">
                                                <div class="card-header bg-primary text-white">
                                                    <h4 class="card-title mb-0">My Cart</h4>
                                                </div>
                                                <div class="card-body p-0">
                                                    <div class="cart-container p-3">
                                                        <div id="cart-items" class="cart-items">
                                                            <!-- Cart items will be populated dynamically -->
                                                        </div>
                                                        <div class="cart-total border-top pt-2 mt-2">
                                                            <div class="d-flex justify-content-between">
                                                                <span class="fw-bold">Net Amount:</span>
                                                                <span class="fw-bold">Rs. <span id="cart-total">0.00</span></span>
                                                            </div>
                                                        </div>
                                                    </div>    
                                                </div>
                                            </div>
                                        </div> 
                                        
                                        <br>

                                        <div class="proof_div" style="display: none;">
                                            <hr>
                                            <label class="form-label">Upload supporting documents for each transcript copy (Maximum file size limit is 2MB per file)</label>
                                            <div id="transcript-proof-container" class="row"></div>
                                        </div>

                                        
                                    

                                        <hr>
                                        
                                        <h2>Student Information (Part 2)</h2>

                                        <div class="form-group">
                                            <div class="col-md-2 mb-2">
                                                <label for="validationCustom02">Title</label>
                                                <select class="form-select" aria-label="Default select example"
                                                    id="title" name="title">
                                                    <option value="Mr">Mr</option>                                                
                                                    <option value="Mrs">Ms</option>
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please choose a title.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-10 mb-3">
                                                <label for="validationCustom01">Name With Initials </label>
                                                <input type="text" class="form-control" id="name_with_initial"
                                                    name="name_with_initial" placeholder="Name With Initial" value=""
                                                    required>
                                                <div class="invalid-feedback">
                                                    Please choose a name with initials.
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-12 mb-3">
                                                <label for="validationCustom01">Full Name (As per degree certificate)
                                                </label>
                                                <input type="text" class="form-control" id="full_name" name="full_name"
                                                    placeholder="Full Name" value="" required>
                                                <div class="invalid-feedback">
                                                    Please choose a name with initials.
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustomUsername">Intake/Programme</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" id="intake_programme"
                                                        name="intake_programme" placeholder="Intake/Programme"
                                                        aria-describedby="inputGroupPrepend" required>
                                                    <div class="invalid-feedback">
                                                        Please choose a intake/programme.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">KDU SVC/Registration Number </label>
                                                <input type="text" class="form-control" id="registration_number"
                                                    name="registration_number" placeholder="Registration Number"
                                                    value="" required>
                                                <div class="invalid-feedback">
                                                    Please choose a registration number.
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">NIC/ Passport Number </label>
                                                <input type="text" class="form-control" id="nic_passport_number"
                                                    name="nic_passport_number" placeholder="NIC/Passport Number"
                                                    value="" required>
                                                <div class="invalid-feedback">
                                                    Please choose a NIC/ Passport number.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">Faculty/ Institute</label>
                                                <select class="form-select" aria-label="Default select example"
                                                    id="faculty" name="faculty">
                                                    <!--<option value="FOE">Faculty of Engineering</option>
                                                    <option value="FOL">Faculty of Law</option>
                                                    <option value="FMSH">Faculty of Management, Social Sciences and Humanities</option>
                                                    <option value="FDSS">Faculty of Defene and Strategic Studies</option>
                                                    <option value="FOC">Faculty of Computing</option>
                                                    <option value="FAHS">Faculty of Allied Health Sciences</option>
                                                    <option value="FBESS">Faculty of Built Environment and Spatial Sciences</option>
                                                    <option value="FOT">Faculty of Technology</option>
                                                    <option value="FOCJ">Faculty of Criminal Justice </option>
                                                    <option value="FGS">Faculty of Graduate Studies</option>
                                                    <option value="ACCT">Accreditied Institutions </option>-->
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please choose a faculty.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">Degree</label>
                                                <select class="form-select" aria-label="Default select example"
                                                    id="degree" name="degree">
                                                    <!--<option value='01'>Master of Philosophy / Doctor of Philosophy
                                                    </option>
                                                    <option value='02'>Master of Law </option>
                                                    <option value='03'>Master of Business Administration in E-Governance
                                                    </option>
                                                    <option value='04'>Master of Business Administration in Logistic
                                                        Management
                                                    </option>
                                                    <option value='05'>MSc in Management </option>
                                                    <option value='06'>MSc in Strategic Studies and International
                                                        Relations
                                                    </option>
                                                    <option value='07'>MSc in Electrical Engineering </option>
                                                    <option value='08'>MSc Electronic & Telecommunication Engineering
                                                    </option>
                                                    <option value='09'>MSc in Civil and Structural Engineering </option>
                                                    <option value='10'>MSc in Disaster Risk Reduction and Development
                                                    </option>
                                                    <option value='11'>MSc in Biomedical Engineering </option>
                                                    <option value='12'>Master of Laws in Business Law </option>
                                                    <option value='13'>Master of Laws in International Law </option>
                                                    <option value='14'>Master of Laws in Public Law </option>
                                                    <option value='15'>Post Graduate Diploma in Management </option>
                                                    <option value='16'>Post Graduate Diploma in Law </option>
                                                    <option value='17'>Post Graduate Diploma in Security and Strategic
                                                        Studies
                                                    </option>
                                                    <option value='18'>Post Graduate Diploma in Electrical Engineering
                                                    </option>
                                                    <option value='19'>Postgraduate Diploma in Electronic and
                                                        Telecommunication
                                                        Engineering </option>
                                                    <option value='20'>Post Graduate Diploma in Civil and Structural
                                                        Engineering
                                                    </option>
                                                    <option value='21'>Postgraduate Diploma in Logistics Management
                                                    </option>
                                                    <option value='22'>BSc Management </option>
                                                    <option value='23'>BSc in Strategic Studies and International
                                                        Relations Degree
                                                    </option>
                                                    <option value='24'>BSc in Engineering (Hons) in Aircraft Maintenance
                                                        Engineering
                                                        Degree </option>
                                                    <option value='25'>BSc in Engineering (Hons) in Aeronautical
                                                        Engineering Degree
                                                    </option>
                                                    <option value='26'>BSc in Engineering (Hons) in Biomedical
                                                        Engineering Degree
                                                    </option>
                                                    <option value='27'>BSc in Engineering (Hons) in Civil Engineering
                                                        Degree
                                                    </option>
                                                    <option value='28'>BSc in Engineering (Hons) in Mechatronic
                                                        Engineering Degree
                                                    </option>
                                                    <option value='29'>BSc in Engineering (Hons) in Mechanical
                                                        Engineering Degree
                                                    </option>
                                                    <option value='30'>BSc in Engineering (Hons) in Electrical and
                                                        Electronic
                                                        Engineering Degree </option>
                                                    <option value='31'>BSc in Engineering (Hons) in Electronic &
                                                        Telecommunication
                                                        Engineering Degree </option>
                                                    <option value='32'>BSc in Engineering (Hons) in Marine Engineering
                                                        Degree
                                                    </option>
                                                    <option value='33'>Bachelor of Laws Degree </option>
                                                    <option value='34'>BSc in Logistics Management Degree with
                                                        Specialized in Supply
                                                        Chain Management </option>
                                                    <option value='35'>BSc in Logistics Management Degree with
                                                        Specialized in
                                                        Financial Management </option>
                                                    <option value='36'>BSc in Logistics Management Degree with
                                                        Specialized in
                                                        Transportation Management </option>
                                                    <option value='37'>BSc in Management and Technical Sciences
                                                    </option>
                                                    <option value='38'>BSc in Social Sciences </option>
                                                    <option value='39'>BSc (Hons) in Computer Engineering Degree
                                                    </option>
                                                    <option value='40'>BSc (Hons) in Computer Science Degree </option>
                                                    <option value='41'>BSc (Hons)in Information Systems Degree </option>
                                                    <option value='42'>BSc (Hons)in Information Technology Degree
                                                    </option>
                                                    <option value='43'>BSc (Hons)in Software Engineering Degree
                                                    </option>
                                                    <option value='44'>BSc (Hons)in Data Science and Business Analytics
                                                    </option>
                                                    <option value='45'>Bachelor of Engineering Technology (Hons)in
                                                        Construction
                                                        Technology </option>
                                                    <option value='46'>Bachelor of Engineering Technology(Hons)in
                                                        Building Services
                                                        Technology </option>
                                                    <option value='47'>Bachelor of Engineering Technology(Hons)in
                                                        Biomedical
                                                        Instrumentation Technology </option>
                                                    <option value='48'>BSc in Police Science Degree </option>
                                                    <option value='49'>BSc in Criminology and & Criminal Justice
                                                    </option>
                                                    <option value='50'>Bachelor of Pharmacy (Hons) Degree </option>
                                                    <option value='51'>BSc (Hons) in Medical Laboratory Sciences Degree
                                                    </option>
                                                    <option value='52'>BSc (Hons) in Nursing Degree </option>
                                                    <option value='53'>BSc (Hons) in Physiotherapy Degree </option>
                                                    <option value='54'>BSc (Hons) in Radiography Degree </option>
                                                    <option value='55'>BSc (Hons) in Radiotherapy Degree </option>
                                                    <option value='56'>BSc (Hons) in Surveying Sciences Degree </option>
                                                    <option value='57'>BSc (Hons) in Quantity Surveying Degree </option>
                                                    <option value='58'>BSc in Built Environment Degree </option>
                                                    <option value='59'>Bachelor of Architecture Degree </option>
                                                    <option value='60'>BSc (Hons) in Industrial and Service Quality
                                                        Management
                                                        Degree
                                                    </option>
                                                    <option value='61'>SLMA </option>
                                                    <option value='62'>NMA </option>
                                                    <option value='63'>SLAFA </option>
                                                    <option value='64'>ASL </option>
                                                    <option value='65'>NIT </option>
                                                    <option value='66'>Master of Science in Defence and Strategic
                                                        Studies</option>
                                                    <option value='67'>Bachelor of Arts </option>
                                                    <option value='68'>Bachelor of Commerce </option>
                                                    <option value='69'>Bachelor of Science in Aircraft Maintenance
                                                        (Hons) Degree</option>
                                                    <option value='70'>Bachelor of Technology (Hons) in Information &
                                                        Communication Technology</option>
                                                    <option value='71'>Bachelor of Biosystems Technology (Hons) in
                                                        Applied Biotechnology</option>
                                                    <option value='72'>Bachelor of Science in Applied Data Science
                                                        Communication</option>
                                                    <option value='73'>Bachelor of Arts in Teaching English to Speakers
                                                        of Other Languages</option>-->

                                                </select>
                                                <div class="invalid-feedback">
                                                    Please choose a degree.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">Year of Convocation</label>
                                                <select class="form-select" aria-label="Default select example" id="date_of_convocation" name="date_of_convocation" required>
                                                    <!-- Options will be populated dynamically by JavaScript -->
                                                </select>
                                                <div class="invalid-feedback">
                                                    Please choose a Year of Convocation.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                        <label for="contact_no_res">Contact No (Residential)</label>
                                        <div class="input-group">
                                            <!-- Country Code Dropdown  -->
                                            <div class="input-group-prepend">
                                            <select class="custom-select country-code-select" id="country_code_res" name="country_code_res" required>
                                                <option value="+93">+93 Afghanistan</option>
                                                <option value="+355">+355 Albania</option>
                                                <option value="+213">+213 Algeria</option>
                                                <option value="+1684">+1684 American Samoa</option>
                                                <option value="+376">+376 Andorra</option>
                                                <option value="+244">+244 Angola</option>
                                                <option value="+1264">+1264 Anguilla</option>
                                                <option value="+672">+672 Antarctica (Australian bases)</option>
                                                <option value="+1268">+1268 Antigua and Barbuda</option>
                                                <option value="+54">+54 Argentina</option>
                                                <option value="+374">+374 Armenia</option>
                                                <option value="+297">+297 Aruba</option>
                                                <option value="+61">+61 Australia</option>
                                                <option value="+43">+43 Austria</option>
                                                <option value="+994">+994 Azerbaijan</option>
                                                <option value="+1242">+1242 Bahamas</option>
                                                <option value="+973">+973 Bahrain</option>
                                                <option value="+880">+880 Bangladesh</option>
                                                <option value="+1246">+1246 Barbados</option>
                                                <option value="+375">+375 Belarus</option>
                                                <option value="+32">+32 Belgium</option>
                                                <option value="+501">+501 Belize</option>
                                                <option value="+229">+229 Benin</option>
                                                <option value="+1441">+1441 Bermuda</option>
                                                <option value="+975">+975 Bhutan</option>
                                                <option value="+591">+591 Bolivia</option>
                                                <option value="+387">+387 Bosnia and Herzegovina</option>
                                                <option value="+267">+267 Botswana</option>
                                                <option value="+55">+55 Brazil</option>
                                                <option value="+359">+359 Bulgaria</option>
                                                <option value="+226">+226 Burkina Faso</option>
                                                <option value="+257">+257 Burundi</option>
                                                <option value="+855">+855 Cambodia</option>
                                                <option value="+237">+237 Cameroon</option>
                                                <option value="+1">+1 Canada</option>
                                                <option value="+56">+56 Chile</option>
                                                <option value="+86">+86 China</option>
                                                <option value="+57">+57 Colombia</option>
                                                <option value="+506">+506 Costa Rica</option>
                                                <option value="+385">+385 Croatia</option>
                                                <option value="+53">+53 Cuba</option>
                                                <option value="+357">+357 Cyprus</option>
                                                <option value="+420">+420 Czech Republic</option>
                                                <option value="+45">+45 Denmark</option>
                                                <option value="+253">+253 Djibouti</option>
                                                <option value="+1767">+1767 Dominica</option>
                                                <option value="+593">+593 Ecuador</option>
                                                <option value="+20">+20 Egypt</option>
                                                <option value="+503">+503 El Salvador</option>
                                                <option value="+372">+372 Estonia</option>
                                                <option value="+251">+251 Ethiopia</option>
                                                <option value="+358">+358 Finland</option>
                                                <option value="+33">+33 France</option>
                                                <option value="+49">+49 Germany</option>
                                                <option value="+233">+233 Ghana</option>
                                                <option value="+30">+30 Greece</option>
                                                <option value="+91">+91 India</option>
                                                <option value="+62">+62 Indonesia</option>
                                                <option value="+98">+98 Iran</option>
                                                <option value="+964">+964 Iraq</option>
                                                <option value="+353">+353 Ireland</option>
                                                <option value="+972">+972 Israel</option>
                                                <option value="+39">+39 Italy</option>
                                                <option value="+81">+81 Japan</option>
                                                <option value="+962">+962 Jordan</option>
                                                <option value="+7">+7 Kazakhstan</option>
                                                <option value="+254">+254 Kenya</option>
                                                <option value="+965">+965 Kuwait</option>
                                                <option value="+371">+371 Latvia</option>
                                                <option value="+961">+961 Lebanon</option>
                                                <option value="+218">+218 Libya</option>
                                                <option value="+370">+370 Lithuania</option>
                                                <option value="+352">+352 Luxembourg</option>
                                                <option value="+853">+853 Macau</option>
                                                <option value="+261">+261 Madagascar</option>
                                                <option value="+60">+60 Malaysia</option>
                                                <option value="+960">+960 Maldives</option>
                                                <option value="+356">+356 Malta</option>
                                                <option value="+230">+230 Mauritius</option>
                                                <option value="+52">+52 Mexico</option>
                                                <option value="+373">+373 Moldova</option>
                                                <option value="+377">+377 Monaco</option>
                                                <option value="+976">+976 Mongolia</option>
                                                <option value="+212">+212 Morocco</option>
                                                <option value="+95">+95 Myanmar</option>
                                                <option value="+977">+977 Nepal</option>
                                                <option value="+31">+31 Netherlands</option>
                                                <option value="+64">+64 New Zealand</option>
                                                <option value="+234">+234 Nigeria</option>
                                                <option value="+850">+850 North Korea</option>
                                                <option value="+47">+47 Norway</option>
                                                <option value="+92">+92 Pakistan</option>
                                                <option value="+507">+507 Panama</option>
                                                <option value="+51">+51 Peru</option>
                                                <option value="+63">+63 Philippines</option>
                                                <option value="+48">+48 Poland</option>
                                                <option value="+351">+351 Portugal</option>
                                                <option value="+974">+974 Qatar</option>
                                                <option value="+40">+40 Romania</option>
                                                <option value="+7">+7 Russia</option>
                                                <option value="+966">+966 Saudi Arabia</option>
                                                <option value="+65">+65 Singapore</option>
                                                <option value="+27">+27 South Africa</option>
                                                <option value="+82">+82 South Korea</option>
                                                <option value="+34">+34 Spain</option>
                                                <option value="+94" selected>+94 Sri Lanka</option>
                                                <option value="+46">+46 Sweden</option>
                                                <option value="+41">+41 Switzerland</option>
                                                <option value="+886">+886 Taiwan</option>
                                                <option value="+66">+66 Thailand</option>
                                                <option value="+90">+90 Turkey</option>
                                                <option value="+971">+971 United Arab Emirates</option>
                                                <option value="+44">+44 United Kingdom</option>
                                                <option value="+1">+1 United States</option>
                                                <option value="+598">+598 Uruguay</option>
                                                <option value="+998">+998 Uzbekistan</option>
                                                <option value="+58">+58 Venezuela</option>
                                                <option value="+84">+84 Vietnam</option>
                                                <option value="+260">+260 Zambia</option>
                                                <option value="+263">+263 Zimbabwe</option>
                                            </select>
                                            </div>

                                            <!-- Actual Number Input -->
                                            <input type="text" class="form-control" id="contact_no_res" name="contact_no_res" placeholder="Enter number" required>

                                            <div class="invalid-feedback">
                                            Please enter a valid contact number.
                                            </div>
                                        </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom02">Contact No (Mobile) </label>
                                                <input type="text" class="form-control" id="contact_no_mobile"
                                                    name="contact_no_mobile" placeholder="Contact No (Mobile)"
                                                    value="" required>
                                                <div class="invalid-feedback">
                                                    Please enter a valid Contact No (Mobile).
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom01">Poastal Address </label>
                                                <input type="phone" class="form-control" id="address" name="address"
                                                    placeholder="Address" value="" required>
                                                <div class="invalid-feedback">
                                                    Please choose a valid Poastal Address.
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom01">Email </label>
                                                <input type="email" class="form-control" id="email" name="email"
                                                    placeholder="Email" value=""
                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required>
                                                <div class="invalid-feedback">
                                                    Please choose a valid email.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustom01">Confirm Email </label>
                                                <input type="email" class="form-control" id="email" name="email"
                                                    placeholder="Email" value=""
                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required>
                                                <div class="invalid-feedback">
                                                    Please choose a valid email.
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <label for="validationCustomUsername">Remarks</label>
                                                <div class="input-group">
                                                    <input type="text" class="form-control" name="other_information"
                                                        id="other_information" placeholder="Other">
                                                </div>
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value=""
                                                        id="invalidCheck" required>
                                                    <label class="form-check-label" for="invalidCheck">
                                                        Agree to terms and conditions
                                                    </label>
                                                    <div class="invalid-feedback">
                                                        You must agree before submitting.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-6 mb-3">
                                                <button class="btn btn-primary" type="submit" name="submit"
                                                    value="submit">Pay Now</button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>


                        </div>
                    </div>

                </div>
                <!-- ./ Content -->

                <footer class="footer fixed-bottom bg-light">
                    <div class="d-flex justify-content-center">
                        <div>© 2025 KDU Examination</div>
                    </div>

                    <!-- Your footer content goes here -->
                </footer>
                <!-- Footer -->

                <!-- ./ Footer -->
            </div>
        </div>
    </main>



    <script src="index.js?v=000001"></script>


</body>

</html>