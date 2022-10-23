function submitPretestAnswers() {
    var total = 5;
    var score = 0;

    // Get User Input
    var q1 = document.forms["quizForm"]["q1"].value,
        q2 = document.forms["quizForm"]["q2"].value,
        q3 = document.forms["quizForm"]["q3"].value,
        q4 = document.forms["quizForm"]["q4"].value,
        q5 = document.forms["quizForm"]["q5"].value;


    // Set Correct Answers
    var answers = ["a", "d", "c", "b", "b"];

    // Check Answers
    for (i = 1; i <= total; i++) {
        if (eval('q' + i) === answers[i - 1]) {
            document.getElementById("q" + i).style.color = "green"
            score++;
        }
        else document.getElementById("q" + i).style.color = "red";
    }

    // Display Results
    var results = document.getElementById('results');
    results.innerHTML = '<h3 class="def-heading">You scored <span>' + score + '</span> out of <span>' + total + '</span></h3>';

    return false;
}