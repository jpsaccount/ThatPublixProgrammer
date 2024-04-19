// import { Project } from "@sdk/./entities/Project";
// import { Client } from "@sdk/./entities/Client";

// import { useDbQuery } from "../sdkHooks/DbHooks";
// import { useEffect, useState } from "react";

// export function useProject(projectId: string) {
//   const [clientId, setClientId] = useState("");

//   const [projectResponse] = useDbQuery(Project, `WHERE c.id = "${projectId}"`);
//   const [clientResponse] = useDbQuery(
//     Client,
//     `WHERE c.id = "${clientId}"`,
//     false,
//     [clientId]
//   );

//   useEffect(() => {
//     if (projectResponse?.data[0]?.ClientId) {
//       setClientId(projectResponse.data[0].ClientId);
//     }
//   }, [projectResponse.data[0].ClientId]);

//   return { projectResponse, clientResponse };
// }
