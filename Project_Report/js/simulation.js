const typeTreeConfig = {
    container: "#typeTree",
    connectors: {
        type: 'curve'
    },
    animation: {
        nodeAnimation: "easeInQuart",
        nodeSpeed: 700,
    },
    animateOnInit: true,
    levelSeparation: 60,
    siblingSeparation: 90,
};

const types = ["int", "float", "bool", "string", "char", "void"];
const typeMap = {
    "int": "integer",
    "float": "float",       
    "bool": "boolean",
    "string": "string",
    "char": "character",
    "void": "void"
};

function parseTypeInput(inputStr, errEl) {
    // Remove all spaces
    inputStr = inputStr.replace(/\s/g, "");
    // Check if input is valid
    if (inputStr === "") {
        errEl.innerHTML = "Please enter a type expression";
        return;
    }

    if (!inputStr.match(/^[a-z]+(\[\d+\])*$/)) {
        errEl.innerHTML = "Invalid type expression";
        return;
    }
    // Check if type is valid
    let splittedInput = inputStr.split("[");
    if (!types.includes(splittedInput[0])) {
        errEl.innerHTML = "Invalid type expression";
        return;
    }

    return splittedInput;
}

function generateNodes(splittedInput) {
    let outputStr = "";
    let nodes = [];

    if (splittedInput.length === 1) {
        outputStr = typeMap[splittedInput[0]];
        nodes.push({
            text: {
                name: outputStr
            }
        });
    } else {
        nodes.push({
            text: {
                name: "array"
            },
        })
        for (let i = 1; i < splittedInput.length; i++) {
            let dimension = splittedInput[i].replace("]", "");
            outputStr += `array(${dimension}, `;
            nodes.push({
                text: {
                    name: dimension
                },
                parent: nodes[nodes.length - 1]
            })
            nodes.push({
                text: {
                    name: "array"
                },
                parent: nodes[nodes.length - 2]
            })
        }
        outputStr += typeMap[splittedInput[0]];
        nodes[nodes.length - 1].text.name = typeMap[splittedInput[0]];
        for (let i = 1; i < splittedInput.length; i++) {
            outputStr += ")";
        }
    }

    return [outputStr, nodes];
}

function generateTypeTree() {
    let errEl = document.getElementById("type-expression-err");
    let outputEl = document.getElementById("simplifiedType");
    let outputLabelEl = document.getElementById("simplifiedTypeLabel");
    let treeEL = document.getElementById("typeTree");
    errEl.innerHTML = "";
    outputEl.innerHTML = "";
    treeEL.innerHTML = "";
    outputLabelEl.style.display = "none";
    let inputStr = document.getElementById("typeExpression").value;
    let splittedInput = parseTypeInput(inputStr, errEl);

    [outputStr, nodes] = generateNodes(splittedInput);

    outputEl.innerHTML = outputStr;
    outputLabelEl.style.display = "inline-block";

    typeTreeConfig.container = "#typeTree";
    simple_chart_config = [
        typeTreeConfig,
        ...nodes
    ];
    let my_chart = new Treant(simple_chart_config, function () {
        console.log("Type Tree generated");
    });
}

function checkEquivalence() {
    let errEl1 = document.getElementById("type-expression-err1");
    let errEl2 = document.getElementById("type-expression-err2");
    let outputEl1 = document.getElementById("simplifiedType1");
    let outputEl2 = document.getElementById("simplifiedType2");
    let outputLabelEl1 = document.getElementById("simplifiedTypeLabel1");
    let outputLabelEl2 = document.getElementById("simplifiedTypeLabel2");
    let treeEL1 = document.getElementById("typeTree1");
    let treeEL2 = document.getElementById("typeTree2");
    let eqivalenceResultEl = document.getElementById("equivalenceResult");
    errEl1.innerHTML = "";
    errEl2.innerHTML = "";
    outputEl1.innerHTML = "";
    outputEl2.innerHTML = "";
    treeEL1.innerHTML = "";
    treeEL2.innerHTML = "";
    eqivalenceResultEl.innerHTML = "";
    outputLabelEl1.style.display = "none";
    outputLabelEl2.style.display = "none";
    let inputStr1 = document.getElementById("typeExpression1").value;
    let inputStr2 = document.getElementById("typeExpression2").value;

    let splittedInput1 = parseTypeInput(inputStr1, errEl1);
    let splittedInput2 = parseTypeInput(inputStr2, errEl2);

    [outputStr1, nodes1] = generateNodes(splittedInput1);
    [outputStr2, nodes2] = generateNodes(splittedInput2);

    let equivalent = true;
    let i = 0;
    for (i = 0; i < nodes1.length && i < nodes2.length; i++) {
        if (nodes1[i].text.name !== nodes2[i].text.name) {
            equivalent = false;
            nodes1[i].HTMLclass = "red";
            nodes2[i].HTMLclass = "red";
        }
    }

    if (i !== nodes1.length) {
        equivalent = false;
        for (let j = i; j < nodes1.length; j++) {
            nodes1[j].HTMLclass = "red";
        }
    }

    if (i !== nodes2.length) {
        equivalent = false;
        for (let j = i; j < nodes2.length; j++) {
            nodes2[j].HTMLclass = "red";
        }
    }

    outputEl1.innerHTML = outputStr1;
    outputEl2.innerHTML = outputStr2;
    outputLabelEl1.style.display = "inline-block";
    outputLabelEl2.style.display = "inline-block";

    typeTreeConfig.container = "#typeTree1";
    simple_chart_config1 = [
        typeTreeConfig,
        ...nodes1   
    ];
    let my_chart1 = new Treant(simple_chart_config1, function () {
        console.log("Type Tree 1 generated");
    });

    typeTreeConfig.container = "#typeTree2";
    simple_chart_config2 = [
        typeTreeConfig,
        ...nodes2
    ];
    let my_chart2 = new Treant(simple_chart_config2, function () {
        console.log("Type Tree 2 generated");
    });

    if (equivalent) {
        eqivalenceResultEl.innerHTML = "The two types are equivalent";
        eqivalenceResultEl.style.color = "green";
    } else {
        eqivalenceResultEl.innerHTML = "The two types are not equivalent";
        eqivalenceResultEl.style.color = "red";
    }
}