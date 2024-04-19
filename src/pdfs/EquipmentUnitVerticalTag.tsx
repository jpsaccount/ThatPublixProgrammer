import { EquipmentType } from "@/sdk/entities/project/equipment/EquipmentType";
import { LightingFixture } from "@/sdk/entities/project/equipment/LightingFixture";
import { LightingFixtureConfiguration } from "@/sdk/entities/project/equipment/LightingFixtureConfiguration";
import { LightingFixtureUnit } from "@/sdk/entities/project/equipment/LightingFixtureUnit";
import { getFullPurpose } from "@/sdk/utils/entityUtils/equipmentUnitUtils";
import { chunkArray } from "@/utilities/arrayUtilities";
import calibri from "@/assets/fonts/CALIBRI.ttf?raw";
import calibrib from "@/assets/fonts/CALIBRIB.ttf?raw";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import pic from ".@/assets/images/favicon.png";
import QrCode from "./QrCode";
Font.register({
  family: "Open Sans",
  fonts: [{ src: calibri }, { src: calibrib, fontWeight: 600 }],
});
Font.registerHyphenationCallback((word) => [word]);
const equipmentUnitDataPreviewStyles = StyleSheet.create({
  page: {
    display: "flex",
    paddingVertical: "27px",
    paddingHorizontal: "18px",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: "18px",
  },
  section: {
    paddingHorizontal: "5px",
    paddingLeft: "7.5px",

    marginTop: "5px",
    display: "flex",
    flexDirection: "row",
  },
  mutedText: {
    fontSize: "5px",
    minHeight: "7px",
    fontWeight: "semibold",
    color: "#004ecc",
    textAlign: "center",
  },
  text: {
    fontSize: "11px",
    minHeight: "13px",
  },
  doubleLineText: {
    fontSize: "11px",
    minHeight: "30px",
    lineHeight: ".95",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "28%",
    height: "100%",
    borderRight: "1px solid #004ecc",
    paddingTop: "5px",
    paddingRight: "10px",
    fontWeight: "semibold",
  },
  rightSection: {
    paddingLeft: "5px",
    width: "72%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    height: "100%",
    paddingTop: "5px",
  },
  iconStyles: {
    position: "absolute",
    right: "25px",
    bottom: "115px",
    height: "130px",
    width: "130px",
    opacity: 0.1,
  },
});

const testQrUrl =
  "https://images.squarespace-cdn.com/content/v1/5d3f241fa4e0350001fa20d5/1636491460338-AIZAXV2978MGIDQE0GT7/qr-code.png";
export default function EquipmentUnitVerticalTag({
  equipmentUnits,
  equipmentTypes,
  equipment,
  equipmentCategories,
  qrCodes,
}: {
  equipmentUnits: LightingFixtureUnit[];
  equipmentTypes: LightingFixtureConfiguration[];
  equipment: LightingFixture[];
  equipmentCategories: EquipmentType[];
  qrCodes: Map<string, string>;
}) {
  const renderTag = (x: LightingFixtureUnit) => {
    const equipmentType = equipmentTypes.find((i) => i.id == x.EquipmentTypeId);
    const currentEquipment = equipment.find((i) => i.id == equipmentType.EquipmentId);
    const category = equipmentCategories.find((i) => i.id == equipmentType.EquipmentCategoryId);
    return (
      <View
        key={x.id}
        style={{
          width: "180px",
          height: "360px",
          // border: "1px solid black",
        }}
      >
        <Image style={equipmentUnitDataPreviewStyles.iconStyles} src={pic}></Image>

        <View style={equipmentUnitDataPreviewStyles.section}>
          <View style={equipmentUnitDataPreviewStyles.leftSection}>
            <Text
              style={{
                ...equipmentUnitDataPreviewStyles.text,
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "4px",
              }}
            >
              UID
            </Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>Type</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>Cir/Panel</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>Add/Unv</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>LCIO</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>Filter</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>Pattern</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>PHL/ACC</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>Install details</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>Notes</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>Purpose</Text>
          </View>
          <View style={equipmentUnitDataPreviewStyles.rightSection}>
            <Text
              style={{
                ...equipmentUnitDataPreviewStyles.text,
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "4px",
              }}
            >
              {x.UnitId}
            </Text>
            <View style={equipmentUnitDataPreviewStyles.doubleLineText}>
              <Text style={equipmentUnitDataPreviewStyles.text}>
                {category.Code + equipmentType.Index + equipmentType.Index2}
              </Text>

              <Text style={equipmentUnitDataPreviewStyles.text}>{currentEquipment?.Nickname}</Text>
            </View>
            <Text style={equipmentUnitDataPreviewStyles.text}>{x.Circuit + "   /   " + x.Panel}</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>
              {x.Control.DMXAddress + "   /   " + x.Control.DMXUniverse}
            </Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>{x.LCIO}</Text>
            <Text style={equipmentUnitDataPreviewStyles.text}>{x.Filter}</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>{x.PatternRawString}</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>{x.Accessories}</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>{x.InstallNotes}</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>{x.SetupNotes}</Text>
            <Text style={equipmentUnitDataPreviewStyles.doubleLineText}>{getFullPurpose(x)}</Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginHorizontal: "5px",
            marginTop: "5px",
            marginBottom: "13.5px",
          }}
        >
          <View
            style={{
              marginHorizontal: "auto",
              height: "50px",
              width: "50px",
              padding: "1px",
              border: "1px solid #004ecc",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "5px",
            }}
          >
            <QrCode width={40} level="H" url={qrCodes.get(x.id)}></QrCode>
          </View>
          <View
            style={{
              marginHorizontal: "auto",
              height: "50px",
              width: "50px",
              padding: "1px",
              border: "1px solid #004ecc",
              borderRadius: "5px",
            }}
          >
            <Text style={equipmentUnitDataPreviewStyles.mutedText}>Focus Direction</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <Document producer="Point of Light Inc." style={{ fontFamily: "Open Sans" }}>
      {chunkArray(equipmentUnits, 6).map((items) => (
        <Page size={[612, 792]} style={equipmentUnitDataPreviewStyles.page}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <View style={equipmentUnitDataPreviewStyles.rowContainer}>
              {items.slice(0, 3).map((x) => renderTag(x))}
            </View>
            <View style={equipmentUnitDataPreviewStyles.rowContainer}>
              {items.slice(3, 6).map((x) => renderTag(x))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
