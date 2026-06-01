interface Props {
  title: string;
  value: string;
}

export default function MetricCard({ title, value }: Props) {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">

      <p className="text-gray-400 text-sm mb-3">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-white">
        {value}
      </h2>

    </div>
  );
}