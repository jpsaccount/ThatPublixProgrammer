import MultiForm from "@/components/MultiForm";
import PolInput from "@/components/polComponents/PolInput";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { Fixture } from "@/sdk/entities/design/Fixture";
import { ChangeEvent, useState } from "react";

const NameFixture = ({ fixture, setFixture }) => {
  const [urlIsValid, setUrlIsValid] = useState(true);

  const response = useDbQuery(Fixture, `WHERE x.Url = "${fixture.Url}"`, undefined);

  const checkUrl = () => {
    console.log(response.data);
    setUrlIsValid(!(response.data.length > 0));
  };

  return (
    <div className=" space-y-4">
      <PolInput
        type="text"
        value={fixture.Title}
        label="Title"
        onValueChanged={(x) => {
          setFixture((prev) => ({
            ...prev,
            Title: x,
          }));
        }}
      />
      <PolInput
        className={`border-2 ${fixture.Url === undefined ? "" : urlIsValid ? "border-green-600" : "border-red-600"}`}
        type="text"
        value={fixture.Url}
        label="Url"
        onValueChanged={(x) => {
          setFixture((prev) => ({
            ...prev,
            Url: x,
          }));
          checkUrl();
        }}
      />
    </div>
  );
};

const DescriptionFixture = ({ fixture, setFixture }) => {
  return (
    <div className=" space-y-4">
      <PolInput
        type="text"
        value={fixture.Title}
        label="Manufacturer Name"
        onValueChanged={(x) => {
          setFixture((prev) => ({
            ...prev,
            ManufacturerName: x,
          }));
        }}
      />
      <PolInput
        type="text"
        value={fixture.Url}
        label="Description"
        onValueChanged={(x) => {
          setFixture((prev) => ({
            ...prev,
            Description: x,
          }));
        }}
      />
    </div>
  );
};

const FixturePhoto = () => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      //upload image
    }
  };

  return <PolInput value="" type="file" label="Photo" onChange={handleFileChange}></PolInput>;
};

const CreateNewFixture = () => {
  const [newFixture, setNewFixture] = useState<Fixture>(new Fixture());
  const CreateFixture = () => {};
  return (
    <MultiForm
      onSuccess={CreateFixture}
      views={[
        ["Title", <NameFixture fixture={newFixture} setFixture={setNewFixture}></NameFixture>],
        ["Describe", <DescriptionFixture fixture={newFixture} setFixture={setNewFixture}></DescriptionFixture>],
        ["Photo", <FixturePhoto></FixturePhoto>],
      ]}
    ></MultiForm>
  );
};

export default CreateNewFixture;
