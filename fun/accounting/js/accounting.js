$("document").ready(function() {

    $("#accountsForm span").hide(); // hide error message
    $("#transactionsForm span").hide();
    $("#detail").hide();

    /*===== Setup script =====*/
    var testAccount = new Account("Samuel", "Eells", "adp1832@hamilton.edu");
    testAccount.credit(500);
    testAccount.debit(245);
    testAccount.debit(34.90);
    testAccount.debit(201.78);

    var testAccount2 = new Account("George", "Washington", "gw@unitedstates.gov");
    testAccount2.credit(12000);
    testAccount2.debit(300.24);
    testAccount2.debit(40);

    var testAccount3 = new Account("Andrew", "Carnegie", "acarngegie@ussteel.com");
    testAccount3.credit(3000000000);
    testAccount3.debit(1000000);
    testAccount3.credit(1200340.50);
    testAccount3.debit(0.98);
    testAccount3.debit(70500);

    populateAccountRow(testAccount);
    populateAccountRow(testAccount2);
    populateAccountRow(testAccount3);

    /*===== STATE VARIABLES =====*/
    /**
    * Simple object to store accounts
    * Will probably need to change this to a data structure that supports sorting.
    */
    var accountsList = {
        "adp1832@hamilton.edu": testAccount, // start it off with a test account, defined above
        "gw@unitedstates.gov": testAccount2,
        "acarngegie@ussteel.com": testAccount3
    };

    /**
    * Keep track of the currently selected account
    */
    var curAccount;

    /*===== EVENTS =====*/
    /**
    * Submitting the Add Account form
    */
    $("#accountsForm").submit(function(event) {
        event.preventDefault();
        $("input").blur();
        // Get values from form
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();

        // Check that none of the values were empty
        if (!validateAccountForm(firstName, lastName, email)) {
            $("#accountsForm span").show();
            return false;
        }

        var newAccount = new Account(firstName, lastName, email);
        accountsList[email] = newAccount;
        populateAccountRow(newAccount);

        // clear the form
        $("#firstName").val("");
        $("#lastName").val("");
        $("#email").val("");
    });
    $("#accountsForm").on("focus", "input", function(event) {
        $("#accountsForm span").hide();
    });

    /**
    * Clicking an account row. Need to use this delegated on function so that
    * each new row still gets the event handler.
    */
    $("#accountsList").on("click", ".accountRow", function(event) {
        var email = $(this).attr("account"); // get the email td
        $("#detail").show();
        populateAccountDetails(email);
    });

    /**
    * Submitting the Add Transaction form
    */
    $("#transactionsForm").submit(function(event) {
        event.preventDefault();
        $("input").blur();
        var amount = $("[name='amount']").val();
        var ttype = $("[name='type']").val();

        if(!validateTransactionForm(amount)) {
            $("#transactionsForm span").show();
            return false;
        }

        if (ttype === "debit") {
            curAccount.debit(amount);
        } else if (ttype === "credit") {
            curAccount.credit(amount);
        }
        populateTransactionRow(curAccount.transactions[curAccount.transactions.length - 1]);
        redrawBalance(curAccount.balance);

        // clear the form
        $("[name='amount']").val("");
    });
    $("#transactionsForm").on("focus", "input", function(event) {
        $("#transactionsForm span").hide();
    });

    /*===== FUNCTIONS =====*/
    /**
    * This function takes an Account object and puts it in the accounts table
    */
    function populateAccountRow(account) {
        $("#accountsList").append(
            "<tr class=\"accountRow\" account=\"" + account.email + "\" data-toggle=\"modal\" data-target=\"#detail\">" + //giving it a class name so we can attach behavior
            "<td>" + account.firstName + "</td>" +
            "<td>" + account.lastName + "</td>" +
            "<td>" + account.email + "</td>" +
            "</tr>"
        );
    }

    /**
    * This function is designed to take the email GUID and retrieve the
    * account details for that account and put them in the account detail section.
    */
    function populateAccountDetails(email) {
        $("#transactionsList").empty();

        curAccount = accountsList[email];
        $("#detailName").html(curAccount.firstName + " " + curAccount.lastName);
        redrawBalance(curAccount.balance);

        var transaction;
        for (var i = 0; i < curAccount.transactions.length; i++) {
            transaction = curAccount.transactions[i];
            populateTransactionRow(transaction);
        }
    }

    /**
    * This function takes a Transaction object and puts it in the transactions table
    */
    function populateTransactionRow(transaction) {
        $("#transactionsList").append(
                "<tr>" +
                "<td>" + formatDate(transaction.date) + "</td>" +
                "<td>" + transaction.transType.toUpperCase() + "</td>" +
                "<td>" + formatDollars(transaction.amount) + "</td>" +
                "<td>" + formatDollars(transaction.remainingBalance) + "</td>" +
                "</tr>"
        );
    }

    /**
    * Utility function that takes a date and returns a pretty string
    */
    function formatDate(date) {
        return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    /**
    * Utility function that takes a number and returns a string formatted in USD
    */
    function formatDollars(num) {
        return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    /**
    * Utility function that takes a number and updates the balance on the screen
    */
    function redrawBalance(num) {
        $("#balance").html(formatDollars(num));
    }

    /**
    * Utility function to validate form.
    */
    function validateAccountForm(firstName, lastName, email) {
        if (firstName === "" || lastName === "" || email === "") {
            return false;
        } else return true;
    }

    /**
    * Utility function to validate transaction form.
    */
    function validateTransactionForm(text) {
        if (!parseFloat(text)) {
            return false;
        } else return true;
    }

    /*===== OBJECT CONSTRUCTORS =====*/
    /**
    * Account object constructor
    */
    function Account(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.transactions = []; // initial list of transactions
        this.balance = 0; // initial balance

        this.debit = function(amount) {
            amount = parseFloat(amount);
            if (amount < 0) {
                alert("Amount must be positive number");
                return null;
            }
            var trans = new Transaction(amount, "debit");
            this.transactions.push(trans);
            this.balance -= amount;
            trans.remainingBalance = this.balance;
        };

        this.credit = function(amount) {
            amount = parseFloat(amount);
            if (amount < 0) {
                alert("Amount must be positive number");
                return null;
            }
            var trans = new Transaction(amount, "credit");
            this.transactions.push(trans);
            this.balance += amount;
            trans.remainingBalance = this.balance;
        };
    }

    /**
    * Transaction object constructor
    */
    function Transaction(amount, type) {
        this.amount = amount;
        this.transType = type;
        this.date = new Date(); // creates timestamp
        // also will have remaining balance
    }

}); // End $("document").ready function
