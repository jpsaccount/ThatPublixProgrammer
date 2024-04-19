import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { getFullPurpose } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import pic from "../../public/assets/images/favicon.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingVertical: "44px",
    paddingHorizontal: "35px",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "36px",
    rowGap: "40px",
    justifyContent: "space-between",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "108.5px",
    height: "108.5px",
    border: "1px solid #000",
  },
  text: {
    marginHorizontal: "auto",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: "Open Sans",
  },
});

const testUid = "12345";
const testType = "S101c: ColorSource Spot V 36deg";
const circuitPanel = "12   /   1620F-DR03";
const lcio = "1620F-LCIO12345";
const universeAddress = "1234   /  123";
const filter = "LMT:1° x 60°";
const pattern = "R:297000000075:96mm + R:297000000075:96mm";

const purpose = "Wizengamot & scenic - right alcove (front)";

const testQrUrl =
  "https://images.squarespace-cdn.com/content/v1/5d3f241fa4e0350001fa20d5/1636491460338-AIZAXV2978MGIDQE0GT7/qr-code.png";
const testFullPurpose = "This is a test full purpose";

// Create Document Component
export const EquipmentUnitTagPdf = ({
  equipmentUnits: equipmentUnits,
  equipmentTypes,
  equipment,
  equipmentCategories,
}) => (
  <Document producer="Point of Light Inc.">
    {/* <EquipmentUnitQrCodeLayout data={equipmentUnits}></EquipmentUnitQrCodeLayout> */}
    {/* <EquipmentUnitVerticalTag
      equipmentUnits={equipmentUnits}
      equipmentTypes={equipmentTypes}
      equipment={equipment}
      equipmentCategories={equipmentCategories}
    ></EquipmentUnitVerticalTag> */}
    ß
  </Document>
);

const equipmentUnitDataPreviewStyles = StyleSheet.create({
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "35px",
  },
  section: {
    padding: "7.2px",
    width: "244.8px",
    height: "169.2px",
    border: "2px solid #000",
    display: "flex",
    flexDirection: "row",
  },
  rowContainer: {
    margin: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "25.92px",
  },
  text: {
    fontSize: "12px",
    fontFamily: "Open Sans",
    minHeight: "15px",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "22.5%",
    height: "100%",
    marginVertical: "auto",
    borderRight: "1px solid #000",
    paddingTop: "5px",
  },
  rightSection: {
    paddingLeft: "9.6px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "77.5%",
    height: "100%",
    marginVertical: "auto",
    paddingTop: "5px",
  },
  iconStyles: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "20px",
    width: "20px",
  },
});

const ar = [1, 2, 3, 4];
function EquimentUnitDataPreview({
  equipmentUnits,
  equipmentTypes,
  equipment,
  equipmentCategories,
}: {
  equipmentUnits: LightingFixtureUnit[];
  equipmentTypes: LightingFixtureConfiguration[];
  equipment: LightingFixture[];
  equipmentCategories: EquipmentType[];
}) {
  return (
    <Page size={[612, 792]} style={equipmentUnitDataPreviewStyles.page}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12.48px",
        }}
      >
        {equipmentUnits.map((x) => {
          const equipmentType = equipmentTypes.find((i) => i.id == x.EquipmentTypeId);
          const currentEquipment = equipment.find((i) => i.id == equipmentType.EquipmentId);
          const category = equipmentCategories.find((i) => i.id == equipmentType.EquipmentCategoryId);
          return (
            <View key={x.id} style={equipmentUnitDataPreviewStyles.rowContainer}>
              <View style={equipmentUnitDataPreviewStyles.section}>
                <View style={equipmentUnitDataPreviewStyles.leftSection}>
                  <Text style={{ ...equipmentUnitDataPreviewStyles.text, fontWeight: 700, fontSize: "14px" }}>UID</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Type</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Circ/Pnl</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>LCIO</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Unv/Add</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Filter</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Pattern</Text>
                </View>
                <View style={equipmentUnitDataPreviewStyles.rightSection}>
                  <Text style={{ ...equipmentUnitDataPreviewStyles.text, fontWeight: 700, fontSize: "14px" }}>
                    {x.UnitId}
                  </Text>

                  <Text style={equipmentUnitDataPreviewStyles.text}>
                    {category.Code + equipmentType.Index + equipmentType.Index2 + ": " + currentEquipment?.Nickname}
                  </Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>{x.Circuit + "   /   " + x.Panel}</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>{x.LCIO}</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>
                    {x.Control.DMXUniverse + "   /   " + x.Control.DMXAddress}
                  </Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>{x.Filter}</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>{x.PatternRawString}</Text>
                  <Image style={equipmentUnitDataPreviewStyles.iconStyles} src={pic}></Image>
                </View>
              </View>
              <View style={equipmentUnitDataPreviewStyles.section}>
                <View style={{ ...equipmentUnitDataPreviewStyles.leftSection, gap: "21.6px" }}>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Purpose</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Acc</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Notes</Text>
                  <Text style={equipmentUnitDataPreviewStyles.text}>Revs</Text>
                </View>
                <View style={{ ...equipmentUnitDataPreviewStyles.rightSection, gap: "21.6px" }}>
                  <Text style={equipmentUnitDataPreviewStyles.text}>{getFullPurpose(x)}</Text>
                  <Image style={equipmentUnitDataPreviewStyles.iconStyles} src={pic}></Image>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Page>
  );
}

interface EquipmentUnitDataPreviewProps {
  uid: string;
  type: string;
  circuitPanel: string;
  lcio: string;
  universeAddress: string;
  filter: string;
  pattern: string;
  purposeSubPurpose: string;
  accessory: string;
  notes: string;
  revs: string;
}

const EquipmentUnitQrCodeLayout = ({ data }) => {
  return (
    <Page size={[612, 792]} style={styles.page}>
      {(() => {
        const arr = [];
        for (let i = 0; i < 20; i++) {
          arr.push(
            <EquipmentUnitQrCodePdf
              key={i}
              uid={testUid}
              qrUrl={testQrUrl}
              fullPurpose={testFullPurpose}
            ></EquipmentUnitQrCodePdf>,
          );
        }
        return arr;
      })()}
    </Page>
  );
};

const EquipmentUnitQrCodePdf = ({ uid, qrUrl, fullPurpose }: { uid: string; qrUrl: string; fullPurpose: string }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.text}>{uid}</Text>
      <Image style={{ marginHorizontal: "auto", height: "80px", width: "80px" }} src={qrUrl}></Image>
    </View>
  );
};
