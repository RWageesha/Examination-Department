<?php
session_start();
if (!defined('APP_BASE')) define('APP_BASE', '/Examination-Department/');
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>How to Pay & Upload Slip</title>
  <link rel="stylesheet" href="<?= APP_BASE ?>assets/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?= APP_BASE ?>assets/dist/css/main.css">
  <style>
    .steps li { margin-bottom: .6rem; }
  </style>
</head>
<body>
<nav class="navbar navbar-expand-md navbar-dark bg-primary mb-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="<?= APP_BASE ?>index.php">KDU Online Registration</a>
  </div>
</nav>

<main class="container">
  <div class="row">
    <div class="col-lg-8 mx-auto">
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">How to Pay</h5>
        </div>
        <div class="card-body">
          <ol class="steps">
            <li>Deposit the total fee at the bank counter OR pay via online banking to the university account:</li>
          </ol>

          <div class="alert alert-secondary">
            <strong>Bank Details</strong><br>
            Bank: <em>Sample Bank PLC</em><br>
            Branch: <em>Ratmalana</em><br>
            Account Name: <em>General Sir John Kotelawala Defence University</em><br>
            Account No: <em>123456789</em><br>
            Reference: <em>Your Registration Number / NIC</em>
          </div>

          <ol start="2" class="steps">
            <li>Keep the receipt clearly visible (reference number, date, amount).</li>
            <li>Scan or photograph the receipt (PDF, JPG, PNG). Make sure it’s readable.</li>
            <li>Upload the file below and submit.</li>
          </ol>
        </div>
      </div>

      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Upload Payment Slip</h5>
        </div>
        <div class="card-body">
          <form action="<?= APP_BASE ?>degree_transcript/submit_payment.php" method="post" enctype="multipart/form-data">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Reference Number (from bank slip)</label>
                <input type="text" name="payment_ref" class="form-control" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Payment Date</label>
                <input type="date" name="payment_date" class="form-control" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Amount (Rs.)</label>
                <input type="number" name="payment_amount" class="form-control" min="0" step="0.01" required>
              </div>
              <div class="col-12">
                <label class="form-label">Upload Slip (PDF/JPG/PNG, max 2MB)</label>
                <input type="file" name="payment_slip" class="form-control" accept="application/pdf,image/png,image/jpeg" required>
              </div>

              <!-- (Optional) carry over some form context from previous page -->
              <!-- <input type="hidden" name="registration_number" value="<?= htmlspecialchars($_POST['registration_number'] ?? '') ?>"> -->

              <div class="col-12 d-flex gap-2 mt-2">
                <a class="btn btn-outline-secondary" href="<?= APP_BASE ?>degree_transcript/index.php">Back</a>
                <button class="btn btn-primary" type="submit">Submit Payment</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <p class="text-muted small mt-3">If you have trouble uploading, reduce file size or use PDF.</p>
    </div>
  </div>
</main>

<script src="<?= APP_BASE ?>assets/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
