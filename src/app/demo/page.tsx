const string = `
Start: Doente > 18 anos com TCE 
--> Decision_1

Decision_1: Critérios para TAC-CE sem constraste ?
- Escala de Coma de Glasgow < 15
- Défice neurológico focal
- Suspeita de fractura aberta/afundada
- Sinais de fractura da base do crânio
- Convulsões
--Sim--> Decision_2
--Não--> Decision_3

Decision_2: Critérios para avaliação por neurocirurgia
- Efeito de massa
- Hematoma epidural ou subdural
- Contusão cerebral
- Hemorragia subaracnoideia extensa, fossa posterior, hemorragia intraventricular ou bilateral
- Fratura craniana deprimida ou diastásica
- Pneumocéfalo
- Edema cerebral 
--Sim--> Node_1
--Não--> Decision_3

Node_1: Contactar neurocirurgia

Decision_3: Critérios para observação intra-hospitalar
- Escala de Coma de Glasgow < 15
- Coagulopatia ou anticoagulação
- Convulsão
- Nenhum cuidador responsável em casa
--Sim--> Node_2
--Não--> Node_3

Node_2: Monitorização intra-hospitalar
Node_3: Observação em ambulatório
`;

type Next_Node_Pointer = {
  next_node_id: string;
  arrow_text?: string;
};

type Start_Node = {
  type: "start";
  id: string;
  title: string;
  text: string;
  next_node_pointer?: Next_Node_Pointer;
};

type Simple_Node = {
  // node id = [type]_[number]
  type: "node";
  id: string;
  title: string;
  text?: string;
  next_node_pointer?: Next_Node_Pointer;
};

type Decision_Node = {
  type: "decision";
  id: string;
  title: string;
  text?: string;
  next_node_pointer: Next_Node_Pointer[];
};

type Any_Node = Simple_Node | Decision_Node;

// const node_dictionary: {[x: string]: Any_Node} = {}

const node_dictionary: { [x: string]: Any_Node } = {
  Node_0: {
    type: "node",
    id: "Node_0",
    title: "Doente > 18 anos com TCE",
    next_node_pointer: {
      next_node_id: "Decision_1",
    },
  },
  Node_1: {
    type: "node",
    id: "Node_1",
    title: "Contactar neurocirurgia",
  },
  Node_2: {
    type: "node",
    id: "Node_2",
    title: "Monitorização intra-hospitalar",
  },
  Node_3: {
    type: "node",
    id: "Node_3",
    title: "Observação em ambulatório",
  },
  Decision_1: {
    type: "decision",
    id: "Decision_1",
    title: "Critérios para TAC-CE sem constraste",
    text: `- Escala de Coma de Glasgow < 15
- Défice neurológico focal
- Suspeita de fractura aberta/afundada
- Sinais de fractura da base do crânio
- Convulsões`,
    next_node_pointer: [
      {
        next_node_id: "Decision_2",
        arrow_text: "Sim",
      },
      {
        next_node_id: "Decision_3",
        arrow_text: "Não",
      },
    ],
  },
  Decision_2: {
    type: "decision",
    id: "Decision_2",
    title: "Critérios para avaliação por neurocirurgia",
    text: `- Efeito de massa
- Hematoma epidural ou subdural
- Contusão cerebral
- Hemorragia subaracnoideia extensa, fossa posterior, hemorragia intraventricular ou bilateral
- Fratura craniana deprimida ou diastásica
- Pneumocéfalo
- Edema cerebral `,
    next_node_pointer: [
      {
        next_node_id: "Node_1",
        arrow_text: "Sim",
      },
      {
        next_node_id: "Decision_3",
        arrow_text: "Não",
      },
    ],
  },
  Decision_3: {
    type: "decision",
    id: "Decision_3",
    title: "Critérios para observação intra-hospitalar",
    text: `- Escala de Coma de Glasgow < 15
- Coagulopatia ou anticoagulação
- Convulsão
- Nenhum cuidador responsável em casa`,
    next_node_pointer: [
      {
        next_node_id: "Node_2",
        arrow_text: "Sim",
      },
      {
        next_node_id: "Node_3",
        arrow_text: "Não",
      },
    ],
  },
};

/* const getNodeFromId = (id: string) => {
  const new_node = node_dictionary[id];
  if (!new_node) throw Error("No node with this id");
  return new_node;
}; */

let final_string = "";

const add_next_node_pointer_2_txt = (
  next_node_pointer: Next_Node_Pointer,
  node_id: string
) => {
  const { arrow_text } = next_node_pointer;
  final_string =
    final_string +
    "\n" +
    `${node_id} --> |${arrow_text ? arrow_text : " "}| ${
      next_node_pointer.next_node_id
    }`;
};

const add_next_node = (node: Any_Node) => {
  // If Simple_Node
  if (node.type === "node") {
    if (!node.next_node_pointer) return;
    add_next_node_pointer_2_txt(node.next_node_pointer, node.id);
    return;
  }
  node.next_node_pointer.forEach((next_node_pointer) => {
    if (!node.next_node_pointer) return;
    add_next_node_pointer_2_txt(next_node_pointer, node.id);
  });
};

const nodeArr = Object.entries(node_dictionary);

const describe_node = (node: Any_Node) => {
  if (node.type === "node")
    final_string =
      final_string +
      "\n" +
      `${node.id}(${node.title}${node?.text ? " \n" + node?.text : ""})`;
  if (node.type === "decision")
    final_string =
      final_string +
      "\n" +
      `${node.id}[${node.title}${node?.text ? " \n" + node?.text : ""}]`;
};

const describe_all_nodes = () =>
  nodeArr.forEach(([_node_id, node], index) => {
    describe_node(node);
  });

const write_relationships = () =>
  nodeArr.forEach(([_node_id, node], index) => {
    add_next_node(node);
  });

describe_all_nodes();
write_relationships();

console.log(final_string);
