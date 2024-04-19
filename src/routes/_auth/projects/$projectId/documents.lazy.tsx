import { withAccess } from "@/components/AuthRoute";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import ProjectDocumentEditorView from "@/views/projects/ProjectDocumentEditor/ProjectDocumentEditorView";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/projects/$projectId/documents")({
  component: withAccess(ProjectDocumentEditorView, AccessKeys.ProjectAdmin),
});

export const useProjectDocumentEditorViewParams = Route.useParams;
