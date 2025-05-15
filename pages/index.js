import Head from "next/head";
import Draggable from "react-draggable";
import { useRef, useState } from "react";
import { Old_Standard_TT, IBM_Plex_Mono } from "next/font/google";
import { IconButton, Snackbar } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const oldStandardTT = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

function Node({
  label,
  index,
  nodes,
  setNodes,
  selectedNode,
  setSelectedNode,
  setSelectedEdge,
}) {
  const draggableRef = useRef();

  let eventLogger = (e, data) => {
    let newNodes = nodes.slice();
    newNodes[index] = {
      ...newNodes[index],
      position: [data.x, data.y],
    };
    setNodes(newNodes);
  };

  return (
    <Draggable
      nodeRef={draggableRef}
      grid={[25, 25]}
      onStart={eventLogger}
      onDrag={eventLogger}
      onStop={eventLogger}
      key={`node_${index}`}
      bounds="parent"
    >
      <div
        ref={draggableRef}
        onClick={() => {
          setSelectedNode(index);
          setSelectedEdge(null);
        }}
        id={`node_${index}`}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          background: "white",
          boxSizing: "border-box",
          border:
            selectedNode == index ? "2px solid #338eda" : "1px solid black",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        {label}
      </div>
    </Draggable>
  );
}

function Edge({
  nodes,
  startNode,
  endNode,
  setEdges,
  selectedEdge,
  setSelectedEdge,
  setSelectedNode,
  index,
  direction,
  label
}) {
  if (nodes[startNode].position[0] == nodes[endNode].position[0]) {
    let height = Math.abs(
      nodes[startNode].position[1] - nodes[endNode].position[1],
    );
    return (
      <div
        style={{
          position: "absolute",
          left: `${nodes[startNode].position[0] + 30}px`,
          top: `${(nodes[startNode].position[1] > nodes[endNode].position[1] ? nodes[endNode].position[1] : nodes[startNode].position[1]) + 30}px`,
          height: `${height}px`,
          borderLeft:
            selectedEdge == index ? "2px solid #338eda" : "1px solid black",
          zIndex: 0,
          display: "flex",
          alignItems: "center",
          fontWeight: 800,
          alignItems:
            (direction == "start_to_end" &&
              nodes[startNode].position[1] > nodes[endNode].position[1]) ||
            (direction == "end_to_start" &&
              nodes[endNode].position[1] > nodes[startNode].position[1])
              ? "flex-start"
              : "flex-end",
        }}
        onClick={() => {
          if (selectedEdge == index) {
            setSelectedEdge(null);
          } else {
            setSelectedEdge(index);
          }
          setSelectedNode(null);
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `rotate(90deg) translateY(12px) ${(direction == "start_to_end" && nodes[startNode].position[1] > nodes[endNode].position[1]) || (direction == "end_to_start" && nodes[endNode].position[1] > nodes[startNode].position[1]) ? "translateX(32px)" : "translateX(-32px)"}`,
          }}
        >
          {direction == "start_to_end"
            ? nodes[startNode].position[1] > nodes[endNode].position[1]
              ? "<"
              : ">"
            : direction == "end_to_start"
              ? nodes[startNode].position[1] > nodes[endNode].position[1]
                ? ">"
                : "<"
              : ""}
        </span>
        {direction == "bidirectional" && (
          <>
            <div
              style={{
                position: "absolute",
                top: "32px",
                transform: "rotate(90deg) translateY(12px)",
              }}
            >{`<`}</div>
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                transform: "rotate(90deg) translateY(12px)",
              }}
            >{`>`}</div>
          </>
        )}
        {label && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-1.75em",
              transform: "translateY(-50%)",
              fontSize: "0.75rem",
              background: "white",
              padding: "1px 4px",
              pointerEvents: "none"
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  let leftNode =
    nodes[startNode].position[0] >= nodes[endNode].position[0]
      ? endNode
      : startNode;
  let rightNode =
    nodes[startNode].position[0] >= nodes[endNode].position[0]
      ? startNode
      : endNode;
  let width = Math.abs(
    nodes[leftNode].position[0] - nodes[rightNode].position[0],
  );
  let height = Math.abs(
    nodes[leftNode].position[1] - nodes[rightNode].position[1],
  );
  let hyptonuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
  let angle = Math.acos(
    (Math.pow(hyptonuse, 2) + Math.pow(width, 2) - Math.pow(height, 2)) /
      (2 * hyptonuse * width),
  );
  let rotationModifier =
    nodes[leftNode].position[1] >= nodes[rightNode].position[1] ? -1 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: `${nodes[leftNode].position[0] + 30}px`,
        top: `${nodes[leftNode].position[1] + 30}px`,
        width: `${hyptonuse}px`,
        borderTop:
          selectedEdge == index ? "2px solid #338eda" : "1px solid black",
        zIndex: 0,
        transformOrigin: "top left",
        transform: `rotate(${rotationModifier * angle}rad)`,
        display: "flex",
        alignItems: "center",
        padding: "0px 32px",
        boxSizing: "border-box",
        fontWeight: 800,
        justifyContent:
          direction == "start_to_end"
            ? leftNode == startNode
              ? "flex-end"
              : "flex-start"
            : direction == "end_to_start"
              ? leftNode == startNode
                ? "flex-start"
                : "flex-end"
              : "",
        position: "relative",
      }}
      onClick={() => {
        if (selectedEdge == index) {
          setSelectedEdge(null);
        } else {
          setSelectedEdge(index);
        }
        setSelectedNode(null);
      }}
    >
      <span style={{ display: "inline-block", transform: "translateY(-15px)" }}>
        {direction == "start_to_end"
          ? leftNode == startNode
            ? ">"
            : "<"
          : direction == "end_to_start"
            ? leftNode == startNode
              ? "<"
              : ">"
            : ""}
      </span>
      {direction == "bidirectional" && (
        <>
          <div
            style={{ position: "absolute", top: "-15px", left: "32px" }}
          >{`<`}</div>
          <div
            style={{ position: "absolute", top: "-15px", right: "32px" }}
          >{`>`}</div>
        </>
      )}
      {label && (
        <div
          style={{
            position: "absolute",
            top: "-1.25em",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "0.75rem",
            background: "white",
            padding: "1px 4px",
            pointerEvents: "none"
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function GeneratedCode({ nodes, edges, language }) {
  // TODO be able to select Typst or Latex for language
  // TODO errors when deleting nodes

  const diagramCode = generateCode(nodes, edges, language);
  const [open, setOpen] = useState(false);

  function getTypstNodes(nodes) {
    const scaleFactor = 100;
    return nodes.filter(node => node != null).map((node) => `node(pos: (${node.position[0] / scaleFactor}, ${node.position[1] / scaleFactor}), label: "${node.label}", name: <${node.label}>)`).join(",\n    ");
  }

  function getTypstDirectionString(edge) {
    if (edge.direction === undefined) {
      return "-";
    }
    // TODO assume that edges are "undirected" or "directed"
    return edge.direction === "undirected" ? "-" : "->";
  }

  function getTypstEdges(nodes, edges) {
    if (nodes.length == 0 || edges.length == 0) {
      return "";
    }
    return edges.map((edge) => {
      const directionString = getTypstDirectionString(edge);
      const labelPart = edge.label && edge.label.trim() !== ""
        ? `, label: "${edge.label}"`
        : "";
      return `edge(<${nodes[edge.start].label}>, <${nodes[edge.end].label}>, "${directionString}"${labelPart})`;
    }).join(",\n    ");
  }

  function generateCode(nodes, edges, language) {
    if (nodes.length == 0 && edges.length == 0) {
      return "No nodes or edges yet!";
    }

    if (language === "typst") {
      let nodesString = getTypstNodes(nodes);
      let edgesString = "";

      if (nodesString !== "") {
        edgesString = getTypstEdges(nodes, edges, false);
      }

      if (edgesString !== "") {
        nodesString += ",\n";
      }

      return (
        `#import "@preview/fletcher:0.5.7" as fletcher: diagram, node, edge\n` +
        `#set page(width: auto, height: auto, margin: 5mm, fill: white)\n` +
        `#diagram(\n` +
        `    node-stroke: 0.5pt, // node circle thickness\n` +
        `    node-shape: "circle",\n` +
        `    ${nodesString}` +
        `    ${edgesString}` +
        `\n` +
        `)`
      );
    } else {
      return "Language not supported";
    }
  }

  return (
    <>
    <div>
      <IconButton
        aria-label="copy"
        onClick={() => {
          navigator.clipboard.writeText(diagramCode);
          setOpen(true);
        }}
        style={{ float: "right" }}
      >
        <ContentCopyIcon />
      </IconButton>

      <Snackbar
        open={open}
        autoHideDuration={1000} // autoclose in 1 sec
        onClose={() => setOpen(false)}
        message="Copied!"
      />
    </div>
    {diagramCode}
    </>
  );
}

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  return (
    <>
      <Head>
        <title>Tangerine</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍊</text></svg>"
        />
      </Head>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          fontSize: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "8px",
          }}
        >
          <div
            className={oldStandardTT.className}
            style={{
              width: "60vw",
              height: "40vw",
              border: "2px solid black",
              position: "relative",
              borderRadius: "8px",
            }}
          >
            {nodes.map(
              (node, index) =>
                node != null && (
                  <Node
                    label={node.label}
                    index={index}
                    nodes={nodes}
                    setNodes={setNodes}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    setSelectedEdge={setSelectedEdge}
                  />
                ),
            )}
            {edges.map((edge, index) => (
              <Edge
                nodes={nodes}
                startNode={edge.start}
                endNode={edge.end}
                setEdges={setEdges}
                selectedEdge={selectedEdge}
                setSelectedEdge={setSelectedEdge}
                setSelectedNode={setSelectedNode}
                index={index}
                direction={edge.direction || "undirected"}
                label={edge.label}
              />
            ))}
            <div
              onClick={() =>
                setNodes([...nodes, { label: nodes.length, position: [0, 0] }])
              }
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "white",
                boxSizing: "border-box",
                border: "2px solid currentColor",
                fontWeight: 700,
                zIndex: 1,
                cursor: "pointer",
              }}
              className="add"
            >
              +
            </div>
          </div>
          <div
            style={{
              border: "2px solid black",
              borderRadius: "8px",
              width: "calc(40vw - 8px - 32px)",
            }}
            className={ibmPlexMono.className}
          >
            <div
              style={{
                background: "#e0e6ed",
                padding: "16px",
                fontWeight: 800,
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              {selectedNode == null
                ? selectedEdge == null
                  ? "Select a node or edge..."
                  : `Edit Edge #${selectedEdge}`
                : `Edit Node #${selectedNode}`}
            </div>
            {selectedEdge != null && (
              <>
              <select
                style={{
                  border: "1px solid black",
                  height: "40px",
                  width: "calc(40vw - 48px - 32px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "16px",
                  boxSizing: "border-box",
                  padding: "8px",
                }}
                onChange={(event) => {
                  const newDirection = event.target.value;

                  setEdges(edges.map((e, i) => {
                    if (i !== selectedEdge) return e;

                    const start = e.start;
                    const end = e.end;

                    if (newDirection === "start_to_end") {
                      return { ...e, direction: newDirection, start, end };
                    } else if (newDirection === "end_to_start") {
                      return { ...e, direction: newDirection, start: end, end: start };
                    } else {
                      return { ...e, direction: newDirection };
                    }
                  }));
                }}
                defaultValue={edges[selectedEdge].direction || "undirected"}
              >
                <option value="undirected">Undirected</option>
                <option value="start_to_end">
                  {nodes[edges[selectedEdge].start].label} to{" "}
                  {nodes[edges[selectedEdge].end].label}
                </option>
                <option value="end_to_start">
                  {nodes[edges[selectedEdge].end].label} to{" "}
                  {nodes[edges[selectedEdge].start].label}
                </option>
                <option value="bidirectional">Bidirectional</option>
              </select>
              <div style={{ margin: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}>
                Edge Label:
              </label>
              <input
                type="text"
                value={edges[selectedEdge]?.label || ""}
                onChange={(e) => {
                  const updatedEdges = edges.map((edge, i) =>
                    i === selectedEdge ? { ...edge, label: e.target.value } : edge
                  );
                  setEdges(updatedEdges);
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  border: "1px solid black",
                  borderRadius: "4px",
                }}
              />
            </div>
            </>
            )}
            {selectedNode != null && (
              //edit node label
              <div style={{ padding: "8px 16px", paddingBottom: "0px" }}>
                <div style={{ marginTop: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Label:</label>
                  <input
                    type="text"
                    value={nodes[selectedNode].label}
                    onChange={(e) => {
                      const updatedNodes = nodes.map((n, i) =>
                        i === selectedNode ? { ...n, label: e.target.value } : n
                      );
                      setNodes(updatedNodes);
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <small>
                  <i>Select nodes to create edges to</i>
                </small>
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                padding: "16px",
                gap: "16px",
              }}
            >
              {selectedNode != null &&
                nodes.map((node, index) => {
                  if (index == selectedNode || node == null) {
                    return <></>;
                  } else {
                    let edge = [];
                    if (selectedNode > index) {
                      edge = { start: index, end: selectedNode };
                    } else {
                      edge = { start: selectedNode, end: index };
                    }
                    return (
                      <div
                        style={{
                          border: "1px solid black",
                          height: "40px",
                          width: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxSizing: "border-box",
                          background:
                            edges.filter(
                              (e) => e.start == edge.start && e.end == edge.end,
                            ).length > 0
                              ? "#5bc0de"
                              : "white",
                        }}
                        onClick={() => {
                          if (
                            edges.filter(
                              (e) => e.start == edge.start && e.end == edge.end,
                            ).length > 0
                          ) {
                            setEdges(
                              edges.filter(
                                (e) =>
                                  e.start != edge.start || e.end != edge.end,
                              ),
                            );
                          } else {
                            setEdges([...edges, { ...edge, label: "" }]);
                          }
                        }}
                      >
                        {nodes[index].label}
                      </div>
                    );
                  }
                })}
            </div>
            {selectedNode != null && (
              <div
                onClick={() => {
                  setNodes(
                    nodes.map((n, index) => (index == selectedNode ? null : n)),
                  );
                  setEdges(
                    edges.filter(
                      (e) =>
                        e.start != selectedNode && e[1].end != selectedNode,
                    ),
                  );
                  setSelectedNode(null);
                }}
                style={{
                  border: "1px solid black",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "8px 16px",
                  boxSizing: "border-box",
                }}
              >
                Delete node
              </div>
            )}
          </div>
          <div
            className={ibmPlexMono.className}
            style={{
              gridColumnStart: 1,
              gridColumnEnd: 3,
              border: "2px solid black",
              position: "relative",
              borderRadius: "8px",
              marginTop: "1em",
              fontSize: "0.5em",
              whiteSpace: "pre",
              padding: "0.5em"
            }}
          >
            <GeneratedCode nodes={nodes} edges={edges} language="typst" />
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .add:hover {
            background: #5bc0de !important;
          }
        `}
      </style>
    </>
  );
}
