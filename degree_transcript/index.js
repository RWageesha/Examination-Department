(function () {
  "use strict";
  window.addEventListener(
    "load",
    function () {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            // Additional check for transcript proofs
            if (document.getElementById("transcript").checked) {
              const copies = parseInt(document.getElementById("transcript_no_of_copies").value) || 0;
              if (copies > 0) {
                const proofInputs = form.querySelectorAll("input[name='transcript_proof[]']");
                let allValid = true;
                
                proofInputs.forEach(function(input) {
                  if (!input.files || input.files.length === 0) {
                    allValid = false;
                    input.classList.add("is-invalid");
                  } else {
                    input.classList.remove("is-invalid");
                  }
                });
                
                if (!allValid) {
                  event.preventDefault();
                  event.stopPropagation();
                  toastr.error("Please upload proof documents for all transcript copies");
                }
              }
            }

            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

$(document).ready(function () {
  var isValid = false;

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-bottom-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };

  var baseUrl = "http://students.kdu.ac.lk/students/online_transcript";

  // Disable right-click
  $(document).on("contextmenu", function (e) {
    e.preventDefault();
  });

  // Disable copy, cut, and paste
  $(document).on("copy paste cut", function (e) {
    e.preventDefault();
    toastr.warning("Copying and Pasting is disabled.");
  });

  // Listen for all keydown events on the document
  $(document).on("keydown", function (e) {

  // Block F12 key (opens DevTools in most browsers)
  if (e.key === "F12") {
    e.preventDefault(); // Cancel the default DevTools opening
    toastr.warning("DevTools are disabled.");
  }

  // 🔒 Block common developer and clipboard shortcuts:
  // Ctrl+Shift+I => Developer Tools
  // Ctrl+Shift+J => JavaScript Console
  // Ctrl+U       => View Page Source
  // Ctrl+C       => Copy
  // Ctrl+V       => Paste
  if (
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
    (e.ctrlKey && (e.key === "U" || e.key === "C" || e.key === "V"))
  ) {
    e.preventDefault(); // Cancel the shortcut action
  }
});


  // Initialize the form
  initForm();

  function initForm() {
    handleCertificateExclusivity();
    populateConvocationYears();
    setupEventListeners();
    updateCart();
    toggleProofDiv();
  }

  function handleCertificateExclusivity() {
    const detailedCert = $("#detailed_degree_certificate");
    const secondCopy = $("#is_second_copy_of_detailed_degree_certificate_already_issued");
    
    detailedCert.on("change", function() {
      if ($(this).is(":checked")) {
        secondCopy.prop("checked", false).prop("disabled", true);
        toastr.info("You can't request both original and replacement certificates");
      } else {
        secondCopy.prop("disabled", false);
      }
      updateCart();
    });
    
    secondCopy.on("change", function() {
      if ($(this).is(":checked")) {
        detailedCert.prop("checked", false).prop("disabled", true);
        toastr.info("Replacement certificate selected - original disabled");
      } else {
        detailedCert.prop("disabled", false);
      }
      updateCart();
    });
  }

  // Populate Year of Convocation dropdown (1980 to current year + 5)
  function populateConvocationYears() {
  var currentYear = new Date().getFullYear(); // 2025
  var startYear = 1980;
  var endYear = currentYear + 5; // 2030
  var convocationSelect = $("#date_of_convocation");

  for (var year = endYear; year >= startYear; year--) {
    convocationSelect.append('<option value="' + year + '">' + year + '</option>');
  }}

  function setupEventListeners() {
    $("#student_category").on("change", updateCart);
    $("input[type='checkbox'], input[type='number']").on("change", updateCart);
    
    // Transcript-specific event listeners
    $("#transcript").on("change", function() {
      updateCart();
      toggleProofDiv();
    });

    $("#transcript_no_of_copies").on("input", function() {
      updateCart();
      toggleProofDiv();
    });
  }

  function generateTranscriptProofInputs(count) {
    const container = $("#transcript-proof-container");
    container.empty();
    
    for(let i = 1; i <= count; i++) {
      const col = $('<div class="col-md-4 mb-3"></div>');
      const input = $(`
        <div class="form-group">
          <label for="transcript_proof_${i}" class="form-label">Transcript Copy ${i} Proof</label>
          <input class="form-control" type="file" name="transcript_proof[]" id="transcript_proof_${i}" required>
          <div class="invalid-feedback">Please upload a proof document</div>
        </div>
      `);
      col.append(input);
      container.append(col);
    }
  }

  function toggleProofDiv() {
    const transcriptChecked = $("#transcript").is(":checked");
    const copies = parseInt($("#transcript_no_of_copies").val()) || 0;
    const proofDiv = $(".proof_div");
    
    if(transcriptChecked && copies > 0) {
      proofDiv.show();
      generateTranscriptProofInputs(copies);
    } else {
      proofDiv.hide();
      $("#transcript-proof-container").empty();
    }
  }

  function updateCart() {
    var total = 0;
    var cartItems = $("#cart-items");
    cartItems.empty(); // Clear existing items

    // Get the selected student category
    var category = $("#student_category").val();
    
    // Set prices based on category
    var detailedPrice, copyPrice, transcriptFirst, transcriptSubsequent, secondCopyPrice;
    
    if (category == "2") { // Undergraduate
        detailedPrice = 300;
        copyPrice = 50;
        transcriptFirst = 400;
        transcriptSubsequent = 250;
        secondCopyPrice = 1500;
    } else { // Postgraduate (category == "1")
        detailedPrice = 2000;
        copyPrice = 400;
        transcriptFirst = 2000;
        transcriptSubsequent = 400;
        secondCopyPrice = 3000;
    }

    // Helper function to add cart items
    function addCartItem(name, qty, price) {
        var totalPrice = qty * price;
        cartItems.append(`
            <div class="cart-item">
                <div class="item-name">${name}</div>
                <div class="item-details">
                    <span>${qty} x Rs. ${price}</span>
                    <span class="item-price">= Rs. ${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        `);
        return totalPrice;
    }

    // Detailed Degree Certificate
    if ($("#detailed_degree_certificate").is(":checked")) {
        var label = category == "2" 
            ? "Detailed Degree Certificate" 
            : "Detailed Degree Certificate (Postgraduate)";
        total += addCartItem(label, 1, detailedPrice);
    }

    // Copies of Detailed Degree Certificate
    if ($("#is_second_copy_of_detailed_degree_certificate").is(":checked")) {
        var copies = parseInt($("#detailed_degree_certificate_no_of_copies").val()) || 0;
        if (copies > 0) {
            var label = category == "2" 
                ? "Certified Copies of Detailed Degree Certificate" 
                : "Certified Copies of Detailed Degree Certificate (Postgraduate)";
            total += addCartItem(label, copies, copyPrice);
        }
    }

    // Transcript
    if ($("#transcript").is(":checked")) {
        var copies = parseInt($("#transcript_no_of_copies").val()) || 0;
        if (copies > 0) {
            var label = category == "2" 
                ? "Transcript" 
                : "Transcript (Postgraduate)";
            
            if (category == "2") { // Undergraduate pricing
                if (copies === 1) {
                    total += addCartItem(label, 1, 400);
                } else {
                    var firstCopy = 400;
                    var subsequentCopies = copies - 1;
                    var totalPrice = firstCopy + (subsequentCopies * 250);
                    
                    cartItems.append(`
                        <div class="cart-item">
                            <div class="item-name">${label}</div>
                            <div class="item-details">
                                <span>1 x Rs. 400 + ${subsequentCopies} x Rs. 250</span>
                                <span class="item-price">= Rs. ${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    `);
                    total += totalPrice;
                }
            } else { // Postgraduate pricing
                if (copies === 1) {
                    total += addCartItem(label, 1, 2000);
                } else {
                    var firstCopy = 2000;
                    var subsequentCopies = copies - 1;
                    var totalPrice = firstCopy + (subsequentCopies * 400);
                    
                    cartItems.append(`
                        <div class="cart-item">
                            <div class="item-name">${label}</div>
                            <div class="item-details">
                                <span>1 x Rs. 2000 + ${subsequentCopies} x Rs. 400</span>
                                <span class="item-price">= Rs. ${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    `);
                    total += totalPrice;
                }
            }
        }
    }

    // Second Copy (Lost Original)
    if ($("#is_second_copy_of_detailed_degree_certificate_already_issued").is(":checked")) {
        var label = category == "2" 
            ? "Second Copy (Lost Original)" 
            : "Second Copy (Postgraduate)";
        total += addCartItem(label, 1, secondCopyPrice);
    }

    // Update total
    $("#cart-total").text(total.toFixed(2));
    $("#payment_amount").val(total);
    toggleProofDiv();
}

  $("#student_category").on("change", function() {
  updateCart(); // Update cart when category changes
  });

  // Event listeners for cart updates
  $("input[type='checkbox'], input[type='number']").on("change", updateCart);

  handleCertificateExclusivity();

    function generateTranscriptProofInputs(count) {
      const container = $("#transcript-proof-container");
      container.empty(); // Clear previous inputs
      
      for(let i = 1; i <= count; i++) {
          const col = $('<div class="col-md-4 mb-3"></div>');
          const input = $(`
              <div class="form-group">
                  <label for="transcript_proof_${i}" class="form-label">Transcript Copy ${i} Proof</label>
                  <input class="form-control" type="file" name="transcript_proof[]" id="transcript_proof_${i}">
                  <div class="error-message" id="error-transcript-proof-${i}"></div>
              </div>
          `);
          col.append(input);
          container.append(col);
      }
  }

  // Add this function to toggle proof section visibility
  function toggleProofDiv() {
      const transcriptChecked = $("#transcript").is(":checked");
      const copies = parseInt($("#transcript_no_of_copies").val()) || 0;
      const proofDiv = $(".proof_div");
      
      if(transcriptChecked && copies > 0) {
          proofDiv.show();
          generateTranscriptProofInputs(copies);
      } else {
          proofDiv.hide();
          $("#transcript-proof-container").empty();
      }
  }

  // Event listeners
  $("#transcript").on("change", function() {
      updateCart();
      toggleProofDiv();
  });

  $("#transcript_no_of_copies").on("input", function() {
      updateCart();
      toggleProofDiv();
  });

  // Initialize on page load
  toggleProofDiv();

  // Student Category change event
  $("#student_category").on("change", function () {
    var category = $(this).val(); // Get selected category value
    var studentTypeSelect = $("#student_type");
    var facultySelect = $("#faculty");
    var degreeSelect = $("#degree");
    
    // Clear existing options
    studentTypeSelect.empty();
    facultySelect.empty();
    degreeSelect.empty();
    
    // Define options based on category
    if (category == "2") { // Undergraduate
      studentTypeSelect.append('<option value="Day Scholar(Local)">Day Scholar(Local)</option>');
      studentTypeSelect.append('<option value="Day Scholar(Local)">Day Scholar(Foreign)</option>');
      studentTypeSelect.append('<option value="Cadet(Local)">Officer Cadet(Local)</option>');
      studentTypeSelect.append('<option value="Cadet(Local)">Officer Cadet(Foreign)</option>');
      studentTypeSelect.append('<option value="Service Officers(Military)">Service Officer(Military)</option>');
      studentTypeSelect.append('<option value="Service Officers(Military)">Service Officer(Police)</option>');
    } else if (category == "1") { // Postgraduate
      studentTypeSelect.append('<option value="Service Officer(Military)">Service Officer(Military)</option>');
      studentTypeSelect.append('<option value="Service Officer(Police)">Service Officer(Police)</option>');
      studentTypeSelect.append('<option value="Other">Civilian Student</option>');
    }

    // Populate faculty based on category
    if (category == "2") { // Undergraduate
      facultySelect.append('<option value="FOE">Faculty of Engineering</option>');
      facultySelect.append('<option value="FOL">Faculty of Law</option>');
      facultySelect.append('<option value="FMSH">Faculty of Management, Social Sciences and Humanities</option>');
      facultySelect.append('<option value="FDSS">Faculty of Defence and Strategic Studies</option>');
      facultySelect.append('<option value="FOC">Faculty of Computing</option>');
      facultySelect.append('<option value="FAHS">Faculty of Allied Health Sciences</option>');
      facultySelect.append('<option value="FBESS">Faculty of Built Environment and Spatial Sciences</option>');
      facultySelect.append('<option value="FOT">Faculty of Technology</option>');
      facultySelect.append('<option value="FOCJ">Faculty of Criminal Justice</option>');
    } else if (category == "1") { // Postgraduate
      facultySelect.append('<option value="FGS">Faculty of Graduate Studies</option>');
      facultySelect.append('<option value="NDC">National Defence College (NDC)</option>');
      facultySelect.append('<option value="DSCSC">Defence Services Command and Staff College (DSCSC)</option>');
      facultySelect.append('<option value="SLMA">Sri Lanka Miltary Academy (SLMA)</option>');
      facultySelect.append('<option value="AWC">Army War College (AWC)</option>');
      facultySelect.append('<option value="NMA">Naval & Maritime Academy (NMA)</option>');
      facultySelect.append('<option value="SLAFA">Sri Lanka Airforce Academy (SLAFA)</option>');
      facultySelect.append('<option value="ASL">Army School of Logistics (ASL)</option>');
    }
    
    // Trigger change events
    studentTypeSelect.trigger("change");
    facultySelect.trigger("change");
  });

  // Faculty change event
  $("#faculty").on("change", function () {
    var faculty = $(this).val();
    var category = $("#student_category").val();
    var degreeSelect = $("#degree");

    // Clear existing degree options
    degreeSelect.empty();

    // Populate degree based on category and faculty/institute
    if (category == "1") { // Postgraduate
      if (faculty == "FGS") { // Faculty of Graduate Studies
        degreeSelect.append('<option value="01">Master of Philosophy / Doctor of Philosophy</option>');
        degreeSelect.append('<option value="02">Master of Laws</option>');
        degreeSelect.append('<option value="03">Master of Business Administration in E-Governance</option>');
        degreeSelect.append('<option value="04">Master of Business Administration in Logistic Management</option>');
        degreeSelect.append('<option value="05">MSc in Management</option>');
        degreeSelect.append('<option value="100">MSc in Security and Strategic Studies</option>');
        degreeSelect.append('<option value="06">MSc in Strategic Studies and International Relations</option>');
        degreeSelect.append('<option value="07">MSc in Electrical Engineering</option>');
        degreeSelect.append('<option value="08">MSc Electronic & Telecommunication Engineering</option>');
        degreeSelect.append('<option value="09">MSc in Civil and Structural Engineering</option>');
        degreeSelect.append('<option value="10">MSc in Disaster Risk Reduction and Development</option>');
        degreeSelect.append('<option value="11">MSc in Biomedical Engineering</option>');
        degreeSelect.append('<option value="12">Master of Laws in Business Law</option>');
        degreeSelect.append('<option value="13">Master of Laws in International Law</option>');
        degreeSelect.append('<option value="14">Master of Laws in Public Law</option>');
        degreeSelect.append('<option value="15">Postgraduate Diploma in Management</option>');
        degreeSelect.append('<option value="16">Postgraduate Diploma in Law</option>');
        degreeSelect.append('<option value="17">Postgraduate Diploma in Security and Strategic Studies</option>');
        degreeSelect.append('<option value="18">Postgraduate Diploma in Electrical Engineering</option>');
        degreeSelect.append('<option value="19">Postgraduate Diploma in Electronic and Telecommunication Engineering</option>');
        degreeSelect.append('<option value="20">Postgraduate Diploma in Civil and Structural Engineering</option>');
        degreeSelect.append('<option value="21">Postgraduate Diploma in Logistics Management</option>');
        //degreeSelect.append('<option value="66">Master of Science in Defence and Strategic Studies</option>');
      } else if (faculty == "NDC") { // National Defence College
        degreeSelect.append('<option value="100">MSc in National Security and Strategic Studies</option>');
        degreeSelect.append('<option value="01">MPhil</option>');
      } else if (faculty == "AWC") { // Army War College
        degreeSelect.append('<option value="74">Postgraduate Diploma in Advanced Military Studies</option>');
        degreeSelect.append('<option value="75">Postgraduate Diploma in Military Studies</option>');
      } else if (faculty == "DSCSC") { // Defence Services Command and Staff College
        degreeSelect.append('<option value="66">MSc in Defence and Strategic Studies</option>');
      }else if (faculty == "SLMA") { // Sri Lanka Miltary Academy
        degreeSelect.append('<option value="109">BSc in Military Studies</option>');
      } else if (faculty == "NMA") { // Naval & Maritime Academy
        degreeSelect.append('<option value="04">Master of Business Administration in Logistic Management</option>');
        degreeSelect.append('<option value="76">PG Diploma (Defence Management)</option>');
        degreeSelect.append('<option value="101">BSc in NMS</option>');
        degreeSelect.append('<option value="102">BSc in NLM</option>');
        degreeSelect.append('<option value="103">BSc in NS</option>');
      } else if (faculty == "SLAFA") { // Sri Lanka Airforce Academy
        degreeSelect.append('<option value="104">BSc in Aviation Studies</option>');
      } else if (faculty == "ASL") { // Army School of Logistics
        degreeSelect.append('<option value="04">Master of Business Administration in Logistic Management</option>');
      } else if (faculty == "SLMA") { // Sri Lanka Military Academy
        degreeSelect.append('<option value="78">BSc in Military Studies</option>');
      }
    } else if (category == "2") { // Undergraduate
      if (faculty == "FMSH") { // Faculty of Management, Social Sciences and Humanities
        degreeSelect.append('<option value="34">BSc in Logistics Management Degree with Specialized in Supply Chain Management</option>');
        degreeSelect.append('<option value="35">BSc in Logistics Management Degree with Specialized in Financial Management</option>');
        degreeSelect.append('<option value="36">BSc in Logistics Management Degree with Specialized in Transportation Management</option>');
        degreeSelect.append('<option value="37">BSc in Management and Technical Sciences</option>');
        degreeSelect.append('<option value="105">BSc in Social Sciences</option>');
        degreeSelect.append('<option value="72">BSc in Applied Data Science Communication</option>');
        degreeSelect.append('<option value="73">Bachelor of Arts in Teaching English to Speakers of Other Languages (TESOL)</option>');
        degreeSelect.append('<option value="22">BSc in Management</option>');
        degreeSelect.append('<option value="79">BSc (Hons) in Management & Technical Sciences</option>');
        degreeSelect.append('<option value="80">BSc (Hons) in Logistics Management</option>');
        degreeSelect.append('<option value="81">BSc (Hons) in International Business and Economics</option>');
        degreeSelect.append('<option value="82">BSc (Hons) in Business Analytics</option>');
        degreeSelect.append('<option value="83">BSc (Hons) in Financial Analytics</option>');
        degreeSelect.append('<option value="67">Bachelor of Arts</option>');
        degreeSelect.append('<option value="68">Bachelor of Commerce</option>');
      } else if (faculty == "FDSS") { // Faculty of Defence and Strategic Studies
        degreeSelect.append('<option value="23">BSc in Strategic Studies and International Relations </option>');
      } else if (faculty == "FOL") { // Faculty of Law
        degreeSelect.append('<option value="33">Bachelor of Laws</option>');
      } else if (faculty == "FOE") { // Faculty of Engineering
        degreeSelect.append('<option value="24">BSc in Engineering (Hons) in Aircraft Maintenance Engineering</option>');//upto intake 36
        degreeSelect.append('<option value="25">BSc in Engineering (Hons) in Aeronautical Engineering</option>');
        degreeSelect.append('<option value="26">BSc in Engineering (Hons) in Biomedical Engineering </option>');
        degreeSelect.append('<option value="27">BSc in Engineering (Hons) in Civil Engineering </option>');
        degreeSelect.append('<option value="28">BSc in Engineering (Hons) in Mechatronic Engineering </option>');
        degreeSelect.append('<option value="29">BSc in Engineering (Hons) in Mechanical Engineering </option>');
        degreeSelect.append('<option value="107">BSc in Engineering (Hons) in Marine Engineering </option>');
        degreeSelect.append('<option value="106">BSc in Engineering (Hons) in Naval Architecture & Marine Engineering </option>');
        degreeSelect.append('<option value="30">BSc in Engineering (Hons) in Electrical and Electronic Engineering </option>');
        degreeSelect.append('<option value="31">BSc in Engineering (Hons) in Electronic & Telecommunication Engineering </option>');
        degreeSelect.append('<option value="32">BSc in Engineering (Hons) in Marine Engineering </option>');
        degreeSelect.append('<option value="69">BSc (Hons) in Aircraft Maintenance </option>');
      } else if (faculty == "FOC") { // Faculty of Computing
        degreeSelect.append('<option value="39">BSc (Hons) in Computer Engineering </option>');
        degreeSelect.append('<option value="40">BSc (Hons) in Computer Science </option>');
        degreeSelect.append('<option value="43">BSc (Hons) in Software Engineering </option>');
        degreeSelect.append('<option value="41">BSc (Hons) in Information Systems </option>');
        degreeSelect.append('<option value="42">BSc (Hons) in Information Technology </option>');
        degreeSelect.append('<option value="44">BSc (Hons) in Data Science and Business Analytics</option>');
      } else if (faculty == "FOT") { // Faculty of Technology
        degreeSelect.append('<option value="45">Bachelor of Engineering Technology (Hons) in Construction Technology</option>');
        degreeSelect.append('<option value="46">Bachelor of Engineering Technology (Hons) in Building Services Technology</option>');
        degreeSelect.append('<option value="47">Bachelor of Engineering Technology (Hons) in Biomedical Instrumentation Technology</option>');
        degreeSelect.append('<option value="71">Bachelor of Biosystems Technology (Hons) in Applied Biotechnology</option>');
        degreeSelect.append('<option value="70">Bachelor of Technology (Hons) in Information & Communication Technology</option>');
      } else if (faculty == "FOCJ") { // Faculty of Criminal Justice
        degreeSelect.append('<option value="48">BSc in Police Science </option>');
        degreeSelect.append('<option value="49">BSc in Criminology and Criminal Justice</option>');
      } else if (faculty == "FAHS") { // Faculty of Allied Health Sciences
        degreeSelect.append('<option value="52">BSc (Hons) in Nursing </option>');
        degreeSelect.append('<option value="53">BSc (Hons) in Physiotherapy </option>');
        degreeSelect.append('<option value="51">BSc (Hons) in Medical Laboratory Sciences </option>');
        degreeSelect.append('<option value="54">BSc (Hons) in Radiography </option>');
        degreeSelect.append('<option value="108">BSc (Hons) in Radiotherapy </option>');
        degreeSelect.append('<option value="50">Bachelor of Pharmacy (Hons) </option>');
      } else if (faculty == "FBESS") { // Faculty of Built Environment and Spatial Sciences
        degreeSelect.append('<option value="59">Bachelor of Architecture (Hons)</option>');
        degreeSelect.append('<option value="57">BSc (Hons) in Quantity Surveying </option>');
        degreeSelect.append('<option value="60">BSc (Hons) in Industrial and Service Quality Management </option>');
        degreeSelect.append('<option value="84">BSc (Hons) in Surveying Sciences</option>');
        degreeSelect.append('<option value="85">BSc (Hons) in Property and Investment Management</option>');
        degreeSelect.append('<option value="86">BSc (Hons) in Geoinformatics</option>');
      }
    }

    // If no degrees are available for the selected faculty, show a placeholder
    if (degreeSelect.children().length === 0) {
      degreeSelect.append('<option value="">No degrees available</option>');
    }
  });

  // Trigger the change event on page load to set initial options
  $("#student_category").trigger("change");

  $("#student_type").on("change", function () {
    if (this.value == "Other") {
      $("#other_category").prop("required", true);
      $("#other_category").prop("readonly", false);
    } else {
      $("#other_category").prop("required", false);
      $("#other_category").prop("readonly", true);
      $("#other_category").val("");
    }
  });

  function uploadImage(proofDoc) {
    var formData = new FormData();
    formData.append("file", $("#file-input")[0].files[0]);

    $.ajax({
      url: baseUrl + "/php_actions/upload.php",
      type: "POST",
      data: formData,
      async: false,
      success: function (data) {
        var obj = JSON.parse(data.trim());
        if (obj.status == 1) {
          submitData(obj.message,proofDoc);
        } else {
          toastr.error(data);
        }
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  }


  function uploadProofDocument() {
    var formData = new FormData();
    formData.append("file", $("#prooffile-input")[0].files[0]);

    $.ajax({
      url: baseUrl + "/php_actions/upload_proof.php",
      type: "POST",
      data: formData,
      async: false,
      success: function (data) {
        var obj = JSON.parse(data.trim());
        if (obj.status == 1) {
          uploadImage(obj.message);
        } else {
          toastr.error(data);
        }
      },
      cache: false,
      contentType: false,
      processData: false,
    });
  }

  $('#transcript').change(function () {
    if ($(this).is(":checked")) {
      $(".proof_div").css({ "display": "unset" });
      $("#prooffile-input").prop("required", true);
    } else {
      $(".proof_div").css({ "display": "none" });
      $("#prooffile-input").prop("required", false);
    }

  });

  function downloadFile(id){
    location.href = baseUrl+'/application_download/degree_transcript_application.php?id='+id;
  }

  function submitData(img,proofDoc) {
    var formData = {
      detailed_degree_certificate: $(
        "input[name=detailed_degree_certificate]"
      ).is(":checked")
        ? 1
        : 0,
      transcript: $("input[name=transcript]").is(":checked") ? 1 : 0,
      is_second_copy_of_detailed_degree_certificate: $(
        "input[name=is_second_copy_of_detailed_degree_certificate]"
      ).is(":checked")
        ? 1
        : 0,
      is_second_copy_of_detailed_degree_certificate_already_issued: $(
        "input[name=is_second_copy_of_detailed_degree_certificate_already_issued]"
      ).is(":checked")
        ? 1
        : 0,
      /*       verification_of_certificate: $(
              "input[name=verification_of_certificate]"
            ).is(":checked")
              ? 1
              : 0, */
      student_category: $("select[name=student_category]").val(),
      student_type: $("select[name=student_type]").val(),
      detailed_degree_certificate_no_of_copies: $(
        "input[name=detailed_degree_certificate_no_of_copies]"
      ).val(),
      transcript_no_of_copies: $("input[name=transcript_no_of_copies]").val(),
      other_category: $("input[name=other_category]").val(),
      title: $("select[name=title]").val(),
      name_with_initial: $("input[name=name_with_initial]").val(),
      full_name: $("input[name=full_name]").val(),
      intake_programme: $("input[name=intake_programme]").val(),
      registration_number: $("input[name=registration_number]").val(),
      nic_passport_number: $("input[name=nic_passport_number]").val(),
      faculty: $("select[name=faculty]").val(),
      degree: $("select[name=degree]").val(),
      date_of_convocation: $("input[name=date_of_convocation]").val(),
      contact_no_res: $("input[name=contact_no_res]").val(),
      contact_no_mobile: $("input[name=contact_no_mobile]").val(),
      address: $("input[name=address]").val(),
      email: $("input[name=email]").val(),
      other_information: $("input[name=other_information]").val(),
      image: img,
      proofDoc:proofDoc
    };

    // process the form
    $.ajax({
      type: "POST",
      url: baseUrl + "/php_actions/submit_request_degree_transcript.php",
      data: formData,
      dataType: "json",
      encode: true,
    })
      .done(function (data) {
        if (data.status == 1) {
          
          downloadFile(data.optional);
          setTimeout(function () {
            location.reload();
          }, 2000);
          toastr.success(data.message);
          return;
        } else {
          toastr.error(data.message);
          return;
        }
      })
      .fail(function (data) {
        toastr.error(data);
      });
  }
  $("#degree-transcript-submit-form").submit(function (event) {
    event.preventDefault(); // prevent the form from submitting the traditional way

    if ($("#degree-transcript-submit-form")[0].checkValidity()) {
      if ($('#transcript').prop("checked")) {
        uploadProofDocument();
      } else {
        uploadImage("none");
      }
    }
  });
});
