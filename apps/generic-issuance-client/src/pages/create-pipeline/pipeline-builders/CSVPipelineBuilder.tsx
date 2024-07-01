import { Box, Button, Card, HStack, Select } from "@chakra-ui/react";
import {
  CSVPipelineDefinition,
  CSVPipelineOutputType,
  FeedIssuanceOptions,
  PipelineType
} from "@pcd/passport-interface";
import { ReactNode, useEffect, useState } from "react";
import { FancyEditor } from "../../../components/FancyEditor";
import { getSampleCSVData, getSampleFeedOptions } from "../../SamplePipelines";
import {
  CSVPreview,
  PreviewType
} from "../../pipeline/PipelineEditSection/CSVPreview";
import { TwoColumns } from "../../pipeline/PipelinePage";
import { FeedOptions } from "./FeedOptions";

interface CSVPipelineBuilderProps {
  onCreate: (pipelineStringified: string) => Promise<void>;
}

const DEFAULT_OUTPUT_TYPE = CSVPipelineOutputType.Message;

export default function CSVPipelineBuilder(
  props: CSVPipelineBuilderProps
): ReactNode {
  const [outputType, setOutputType] =
    useState<CSVPipelineOutputType>(DEFAULT_OUTPUT_TYPE);
  const [csv, setCsv] = useState(() => getSampleCSVData(DEFAULT_OUTPUT_TYPE));
  const [feedOptions, setFeedOptions] = useState<FeedIssuanceOptions>(() =>
    getSampleFeedOptions(DEFAULT_OUTPUT_TYPE)
  );
  const [previewType, setPreviewType] = useState<PreviewType | undefined>(
    undefined
  );

  useEffect(() => {
    setCsv(getSampleCSVData(outputType));
    setFeedOptions(getSampleFeedOptions(outputType));
  }, [outputType]);

  return (
    <>
      <TwoColumns
        style={{
          gap: "8px",
          height: "100%",
          justifyContent: "space-between",
          alignItems: "stretch"
        }}
      >
        <div
          className="col1"
          style={{ minWidth: "fit-content", width: "fit-content", flexGrow: 0 }}
        >
          <Card overflow="hidden" width="fit-content">
            <Box maxW="800px" minW="800px" height="500px">
              {previewType === undefined && (
                <FancyEditor
                  editorStyle={{ height: "500px", width: "800px" }}
                  dark
                  value={csv}
                  setValue={setCsv}
                />
              )}
              {previewType !== undefined && (
                <CSVPreview
                  csv={csv}
                  previewType={previewType}
                  onChange={setCsv}
                />
              )}
            </Box>
          </Card>
          <HStack mt={2} minWidth="fit-content" width="fit-content">
            <Button
              flexShrink={0}
              disabled={previewType === undefined}
              colorScheme={previewType === undefined ? "blue" : undefined}
              onClick={(): void => setPreviewType(undefined)}
            >
              CSV
            </Button>

            <Button
              flexShrink={0}
              disabled={previewType === PreviewType.CSVSheet}
              colorScheme={
                previewType === PreviewType.CSVSheet ? "blue" : undefined
              }
              onClick={(): void => setPreviewType(PreviewType.CSVSheet)}
            >
              Preview
            </Button>
          </HStack>
        </div>
        <div
          className="col2"
          style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <Select
            bg="rgba(29,29,29,1)"
            mb={2}
            width="100%"
            value={outputType}
            onChange={(e): void => {
              setOutputType(e.target.value as CSVPipelineOutputType);
            }}
          >
            {Object.entries(CSVPipelineOutputType).map(([k, v]) => (
              <option value={v} key={v}>
                output type: {k}
              </option>
            ))}
          </Select>

          <FeedOptions
            feedOptions={feedOptions}
            setFeedOptions={setFeedOptions}
          />

          <Button
            mt={2}
            width="100px"
            maxW="100px"
            colorScheme="green"
            onClick={(): Promise<void> =>
              props.onCreate(
                JSON.stringify({
                  type: PipelineType.CSV,
                  timeCreated: new Date().toISOString(),
                  timeUpdated: new Date().toISOString(),
                  editorUserIds: [],
                  options: {
                    name: feedOptions.feedFolder,
                    csv,
                    feedOptions,
                    outputType
                  }
                } satisfies Partial<CSVPipelineDefinition>)
              )
            }
          >
            Create
          </Button>
        </div>
      </TwoColumns>
    </>
  );
}
