const loaderPath =
  "M29.760000000000005 18.72 c0 7.28 -3.9200000000000004 13.600000000000001 -9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.840000000000002 2.64 c -3.6 0 -6.88 -0.96 -9.76 -2.64 c0 -7.28 3.9200000000000004 -13.52 9.840000000000002 -16.96 c2.8800000000000003 -1.6800000000000002 6.24 -2.64 9.76 -2.64 S26.880000000000003 17.040000000000003 29.760000000000005 18.72 c5.84 3.3600000000000003 9.76 9.68 9.840000000000002 16.96 c -2.8800000000000003 1.6800000000000002 -6.24 2.64 -9.76 2.64 c -3.6 0 -6.88 -0.96 -9.840000000000002 -2.64 c -5.84 -3.3600000000000003 -9.76 -9.68 -9.76 -16.96 c0 -7.28 3.9200000000000004 -13.600000000000001 9.76 -16.96 C25.84 5.120000000000001 29.760000000000005 11.440000000000001 29.760000000000005 18.72z";

export function LoaderView() {
  return (
    <section
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="loader" role="status" aria-hidden>
          <svg
            preserveAspectRatio="xMidYMid meet"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            y="0px"
            x="0px"
            className="container"
          >
            <path
              d={loaderPath}
              pathLength="100"
              strokeWidth="4"
              fill="none"
              className="track"
            />
            <path
              d={loaderPath}
              pathLength="100"
              strokeWidth="4"
              fill="none"
              className="car"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400">Cargando...</p>
      </div>
    </section>
  );
}
