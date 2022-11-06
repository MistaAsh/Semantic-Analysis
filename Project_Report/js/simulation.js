const typeTreeConfig = {
  container: "#typeTree",
  connectors: {
    type: "curve",
  },
  animation: {
    nodeAnimation: "easeInQuart",
    nodeSpeed: 700,
  },
  animateOnInit: true,
  levelSeparation: 60,
  siblingSeparation: 90,
};

const types = ["int", "double", "long", "float", "bool", "string", "char", "void"];
const typeMap = {
  "int": "integer",
  "double": "double",
  "long": "long",
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
        name: outputStr,
      },
    });
  } else {
    nodes.push({
      text: {
        name: "array",
      },
    });
    for (let i = 1; i < splittedInput.length; i++) {
      let dimension = splittedInput[i].replace("]", "");
      outputStr += `array(${dimension}, `;
      nodes.push({
        text: {
          name: dimension,
        },
        parent: nodes[nodes.length - 1],
      });
      nodes.push({
        text: {
          name: "array",
        },
        parent: nodes[nodes.length - 2],
      });
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
  simple_chart_config = [typeTreeConfig, ...nodes];
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
  simple_chart_config1 = [typeTreeConfig, ...nodes1];
  let my_chart1 = new Treant(simple_chart_config1, function () {
    console.log("Type Tree 1 generated");
  });

  typeTreeConfig.container = "#typeTree2";
  simple_chart_config2 = [typeTreeConfig, ...nodes2];
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

function getSyntaxTree() {
  config = {
    chart: {
      container: "#syntaxTree1",
    },

    nodeStructure: {
      text: { name: "=" },
      children: [
        {
          text: { name: "LHS" },
        },
      ],
    },
  };

  let chart = new Treant(config, () => {
    console.log("Syntax Tree generated");
  });
}


function getCombinedType(type1, type2) {

  if (type1 === "int") {

    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "int";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "float") {
    if (type2 === "int")
      return "float";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "float";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "float";

    if (type2 === "char")
      return "float";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "double") {
    if (type2 === "int")
      return "double";

    if (type2 === "float")
      return "double";

    if (type2 === "bool")
      return "double";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "double";

    if (type2 === "char")
      return "double";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "long") {
    if (type2 === "int")
      return "long";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "long";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "long";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "bool") {
    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "bool";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "string") {
    if (type2 === "int")
      return "incompatible_type";

    if (type2 === "float")
      return "incompatible_type";

    if (type2 === "bool")
      return "incompatible_type";

    if (type2 === "string")
      return "string";

    if (type2 === "long")
      return "incompatible_type";

    if (type2 === "char")
      return "string";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "incompatible_type";

  }

  if (type1 === "char") {

    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "int";

    if (type2 === "string")
      return "string";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "void") {
    if (type2 === "void")
      return "void"
    return "incompatible_type"
  }
}

function getStarCombinedType(type1, type2) {

  if (type1 === "int") {

    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "int";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "float") {
    if (type2 === "int")
      return "float";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "float";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "float";

    if (type2 === "char")
      return "float";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "double") {
    if (type2 === "int")
      return "double";

    if (type2 === "float")
      return "double";

    if (type2 === "bool")
      return "double";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "double";

    if (type2 === "char")
      return "double";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "long") {
    if (type2 === "int")
      return "long";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "long";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "long";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "bool") {
    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "bool";

    if (type2 === "string")
      return "incompatible_type";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "string") {
    if (type2 === "int")
      return "incompatible_type";

    if (type2 === "float")
      return "incompatible_type";

    if (type2 === "bool")
      return "incompatible_type";

    if (type2 === "string")
      return "string";

    if (type2 === "long")
      return "incompatible_type";

    if (type2 === "char")
      return "incompatible_type";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "incompatible_type";

  }

  if (type1 === "char") {

    if (type2 === "int")
      return "int";

    if (type2 === "float")
      return "float";

    if (type2 === "bool")
      return "int";

    if (type2 === "string")
      return "string";

    if (type2 === "long")
      return "long";

    if (type2 === "char")
      return "int";

    if (type2 === "void")
      return "incompatible_type";

    if (type2 === "double")
      return "double";

  }

  if (type1 === "void") {
    if (type2 === "void")
      return "void"
    return "incompatible_type"
  }
}

function checkLeftRightTypeEquivalence(left_type, right_type) {
  if (left_type == "int") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }

  if (left_type == "float") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }

  if (left_type == "double") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }

  if (left_type == "long") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }

  if (left_type == "bool") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }


  if (left_type == "char") {
    if (right_type == "int" || right_type == "float" || right_type == "long" || right_type == "double" || right_type == "char")
      return true

    return false;
  }
  if (left_type == "string") {
    if (right_type === "string")
      return true;
    return false;
  }

  if (left_type == "void") {
    if (right_type == "void")
      return true;

    return false;
  }

  return false;



}

function isInputValid() {
  lhs = document.getElementById("lhs").value;
  operand1_type = document.getElementById("operand1").value.toLowerCase().trim().replace(/\s/g, '');
  operand2_type = document.getElementById("operand2").value.toLowerCase().trim().replace(/\s/g, '');
  operand3_type = document.getElementById("operand3").value.toLowerCase().trim().replace(/\s/g, '');

  if (lhs === "" || operand1_type === "" || operand2_type === "" || operand3_type === "") {
    return false;
  }


  if (!types.includes(lhs) || !types.includes(operand1_type) || !types.includes(operand2_type) || !types.includes(operand3_type)) {
    return false;
  }

  return true;
}

function createTrees(){
  let valid = isInputValid();
  if(!valid){
    //Show Error Message
    return;
  } 

  createSyntaxTree();
  createAnnotatedSyntaxTree();
}

function createSyntaxTree() {
  lhs = document.getElementById("lhs").value;
  operand1_type = document.getElementById("operand1").value.toLowerCase().trim().replace(/\s/g, '');
  operand2_type = document.getElementById("operand2").value.toLowerCase().trim().replace(/\s/g, '');
  operand3_type = document.getElementById("operand3").value.toLowerCase().trim().replace(/\s/g, '');

  //   console.log(operand1_type, operand2_type, operand3_type);

  star_type = getCombinedType(operand2_type, operand3_type);
  plus_type = getCombinedType(operand1_type, star_type);
  eq_type = getCombinedType(lhs, plus_type);

  console.log("star types: ", star_type, plus_type, eq_type);

  //   document.getElementById("star").innerHTML = "*" + star_type;
  //   document.getElementById("plus").innerHTML = "+" + plus_type;
  //   document.getElementById("eq").innerHTML = "=" + eq_type;

  config = {
    chart: {
      container: "#syntaxTree1",
      connectors: {
        type: "curve",
      },
      animation: {
        nodeAnimation: "easeInQuart",
        nodeSpeed: 700,
      },
      animateOnInit: true,
      levelSeparation: 60,
      siblingSeparation: 90,
    },

    nodeStructure: {
      text: { name: "= (" + eq_type + ")" },
      children: [
        {
          text: lhs,
        },
        {
          text: { name: "+ (" + plus_type + ")" },
          children: [
            {
              text: operand1_type,
            },

            {
              text: "* (" + star_type + ")",
              children: [
                {
                  text: operand2_type,
                },
                {
                  text: operand3_type,
                },
              ],
            },
          ],
        },
      ],
    },
  };

  let chart = new Treant(config, () => {
    console.log("Syntax Tree generated");
  });

  console.log(lhs, operand1_type, operand2_type, operand3_type);
}


function createAnnotatedSyntaxTree() {

}