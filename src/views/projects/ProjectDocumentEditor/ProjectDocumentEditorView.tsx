import PolIcon from "@/components/PolIcon";
import { PolButton } from "@/components/polComponents/PolButton";
import PolHeading from "@/components/polComponents/PolHeading";
import PolModal from "@/components/polComponents/PolModal";
import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import { Seo } from "@/components/polComponents/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import { useProjectDocumentEditorViewParams } from "@/routes/_auth/projects/$projectId/documents.lazy";
import { Project } from "@/sdk/entities/project/Project";
import { Contract, Directive, Proposal } from "@/sdk/entities/project/ProposalLineItem";
import { WorkingPhase } from "@/sdk/entities/project/WorkingPhase";
import ContractEditor from "@/views/projects/ProjectDocumentEditor/ContractEditor";
import DirectiveEditor from "@/views/projects/ProjectDocumentEditor/DirectiveEditor";
import { ProjectDocumentAccordionContent } from "@/views/projects/ProjectDocumentEditor/ProjectDocumentAccordionContent";
import { ProjectDocumentAccordionHeader } from "@/views/projects/ProjectDocumentEditor/ProjectDocumentAccordionHeader";
import ProposalEditor from "@/views/projects/ProjectDocumentEditor/ProposalEditor";
import WorkingPhaseEditor from "@/views/projects/ProjectDocumentEditor/WorkingPhaseEditor";
import { PhaseActivityBucket } from "@sdk/./entities/billing/PhaseActivityBucket";
import { tryGetSum } from "@sdk/./utils/arrayUtils";
import { toUsdString } from "@sdk/./utils/moneyUtils";
import { isNullOrWhitespace } from "@sdk/./utils/stringUtils";
import { isUsable } from "@sdk/./utils/usabilityUtils";
import { Dropdown } from "flowbite-react";
import { useState } from "react";

function WorkingPhaseEditorModal(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PolModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      modalTrigger={
        <button onClick={() => setIsOpen(true)} className="hover:bg-accent w w-full p-1 pr-6 hover:bg-background-100">
          <div className="grid w-full grid-flow-col">
            <h4 className="text-left">
              {isNullOrWhitespace(props.x.DisplayName) ? props.x.Title : props.x.DisplayName}
            </h4>
            <h4 className="text-right">{toUsdString(props.x.AmountAllotted)}</h4>
          </div>
        </button>
      }
    >
      <WorkingPhaseEditor
        phaseActivityBuckets={props.data}
        workingPhase={props.x}
        onSave={() => setIsOpen(false)}
      ></WorkingPhaseEditor>
    </PolModal>
  );
}

export default function ProjectDocumentEditorView() {
  const { projectId } = useProjectDocumentEditorViewParams();

  const request = useDbQueryFirst(Project, `WHERE c.id = '${projectId}'`);
  const saveProjectMutation = useDbUpsert(Project);
  const workingPhasesRequest = useDbQuery(WorkingPhase, `WHERE c.ProjectId = "${projectId}"`);
  const phaseActivityBucketRequest = useDbQuery(PhaseActivityBucket);

  const updateProject = async (updates: Partial<Project>) => {
    const newProject = { ...request.data, ...updates };

    await saveProjectMutation.mutateAsync(newProject);
    await workingPhasesRequest.refetch();
  };

  const [selectedProposal, setSelectedProposal] = useState<Proposal | undefined>(undefined);
  const [selectedDirective, setSelectedDirective] = useState<Directive | undefined>(undefined);
  const [selectedContract, setSelectedContract] = useState<Contract | undefined>(undefined);

  return (
    <>
      <Seo title={"Documents"} />

      <PolModal isOpen={isUsable(selectedProposal)} onClose={() => setSelectedProposal(undefined)}>
        <ProposalEditor
          workingPhases={workingPhasesRequest.data}
          proposal={selectedProposal}
          onProposalSaved={(p) =>
            updateProject({ Proposals: [...request.data.Proposals.filter((x) => x.Id != p.Id), p] }).then(() =>
              setSelectedProposal(undefined),
            )
          }
        ></ProposalEditor>
      </PolModal>
      <PolModal
        isOpen={isUsable(selectedContract)}
        onClose={() => {
          setSelectedContract(undefined);
        }}
      >
        <ContractEditor
          workingPhases={workingPhasesRequest.data}
          contract={selectedContract}
          onContractSaved={(c) =>
            updateProject({ Contracts: [...request.data.Contracts.filter((x) => x.Id != c.Id), c] }).then(() =>
              setSelectedContract(undefined),
            )
          }
        ></ContractEditor>
      </PolModal>
      <PolModal
        isOpen={isUsable(selectedDirective)}
        onClose={() => {
          setSelectedDirective(undefined);
        }}
      >
        <DirectiveEditor
          workingPhases={workingPhasesRequest.data}
          directive={selectedDirective}
          onDirectiveSaved={(d) =>
            updateProject({ Directives: [...request.data.Directives.filter((x) => x.Id != d.Id), d] }).then(() =>
              setSelectedDirective(undefined),
            )
          }
        ></DirectiveEditor>
      </PolModal>
      <PolRequestPresenter
        request={request}
        onSuccess={() => {
          const proposals = [...request.data.Proposals];
          const directives = [...request.data.Directives];
          const contracts = [...request.data.Contracts];
          return (
            <div className="grid grid-flow-row">
              <PolHeading className="text-center">{request.data.Nickname}</PolHeading>
              <div className="mx-2 grid grid-flow-col grid-cols-[1fr_auto]">
                <PolHeading size={2}> Documents</PolHeading>

                <Dropdown
                  className="z-[10000]"
                  arrowIcon={false}
                  inline
                  label={
                    <PolButton>
                      <PolIcon name="Plus" stroke="white"></PolIcon>
                    </PolButton>
                  }
                >
                  {/* <Dropdown.Header>
          <span className="block text-sm">{getName(user?.Person)}</span>
          <span className="block truncate text-sm font-medium">{user?.Person.Emails[0]}</span>
        </Dropdown.Header> */}
                  <Dropdown.Item onClick={() => setSelectedProposal(new Proposal())}>Proposal</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedDirective(new Directive())}>Directive</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedContract(new Contract())}>Contract</Dropdown.Item>
                </Dropdown>
              </div>
              <ScrollArea className="w-full px-2">
                <Accordion type="multiple">
                  <AccordionItem value="proposals">
                    <AccordionTrigger>
                      <ProjectDocumentAccordionHeader Title="Proposals" Documents={proposals} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <ProjectDocumentAccordionContent onClick={setSelectedProposal} Documents={proposals} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="directives">
                    <AccordionTrigger>
                      <ProjectDocumentAccordionHeader Title="Directives" Documents={directives} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <ProjectDocumentAccordionContent onClick={setSelectedDirective} Documents={directives} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="contracts">
                    <AccordionTrigger>
                      <ProjectDocumentAccordionHeader Title="Contracts" Documents={contracts} />
                    </AccordionTrigger>
                    <AccordionContent>
                      <ProjectDocumentAccordionContent onClick={setSelectedContract} Documents={contracts} />
                    </AccordionContent>
                  </AccordionItem>

                  <PolHeading className="mb-4 mt-12" size={2}>
                    Working Phases
                  </PolHeading>

                  <PolRequestPresenter
                    request={workingPhasesRequest}
                    onSuccess={() => (
                      <>
                        <AccordionItem value="WorkingPhaseActive">
                          <AccordionTrigger>
                            <div className="grid w-full grid-flow-col border-t">
                              <h4 className="text-left">
                                Active ({workingPhasesRequest.data.filter((x) => x.ShowInTimesheet).length})
                              </h4>
                              <h4 className="mx-2 text-right">
                                {toUsdString(
                                  tryGetSum(
                                    workingPhasesRequest.data
                                      .filter((x) => x.ShowInTimesheet)
                                      .map((x) => x.AmountAllotted),
                                  ),
                                )}
                              </h4>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-flow-row">
                              {workingPhasesRequest.data
                                .filter((x) => x.ShowInTimesheet)
                                .map((x) => (
                                  <WorkingPhaseEditorModal
                                    data={phaseActivityBucketRequest.data}
                                    x={x}
                                  ></WorkingPhaseEditorModal>
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="WorkingPhaseInactive">
                          <AccordionTrigger>
                            <div className="grid w-full grid-flow-col border-t">
                              <h4 className="text-left">
                                Inactive ({workingPhasesRequest.data.filter((x) => x.ShowInTimesheet === false).length})
                              </h4>
                              <h4 className="mx-2 text-right">
                                {toUsdString(
                                  tryGetSum(
                                    workingPhasesRequest.data
                                      .filter((x) => x.ShowInTimesheet === false)
                                      .map((x) => x.AmountAllotted),
                                  ),
                                )}
                              </h4>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-flow-row">
                              {workingPhasesRequest.data
                                .filter((x) => x.ShowInTimesheet === false)
                                .map((x) => (
                                  <WorkingPhaseEditorModal data={phaseActivityBucketRequest.data} x={x} />
                                ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </>
                    )}
                  />
                </Accordion>
              </ScrollArea>
            </div>
          );
        }}
      />
    </>
  );
}
