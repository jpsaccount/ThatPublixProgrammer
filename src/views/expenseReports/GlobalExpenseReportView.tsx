export default function GlobalExpenseReportMobileItemView({ onClick, x }) {
  return (
    <div
      className="grid grid-flow-col border-top border-b py-2.5 px-2 mobile-card-item space-x-2"
      onClick={onClick}
      tabIndex={-1}
      key={x.id}
    >
      <div className="grid">
        <div className="font-medium text-left">{x.Title}</div>
        <div className="font-medium text-left text-xs">{x.Description}</div>
      </div>
      <div className="text-sm text-right">
        {x.StartDate?.format("MM/DD/YYYY")} - {x.EndDate?.format("MM/DD/YYYY")}
      </div>
    </div>
  );
}
