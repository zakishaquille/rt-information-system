import React, { useState } from "react";
import { HTTPError } from "ky";
import {
  RateStatus,
  type DueTypeRate,
  type DueTypeRateInput,
  type RateStatusType,
} from "../types";
import { DueTypeRateForm } from "./DueTypeRateForm";
import { DueTypeRateHistory } from "./DueTypeRateHistory";
import { formatRp } from "@/utils/formatRp";

const today = () => new Date().toISOString().split("T")[0];

interface DueTypeRatesSectionProps {
  rates: DueTypeRate[];
  loading: boolean;
  createRate: (data: DueTypeRateInput) => Promise<void>;
  deleteRate: (id: number) => Promise<void>;
}

export const DueTypeRatesSection: React.FC<DueTypeRatesSectionProps> = ({
  rates,
  loading,
  createRate,
  deleteRate,
}) => {
  const [showRateForm, setShowRateForm] = useState(false);
  const todayStr = today();

  const getRateStatus = (r: {
    effective_from: string;
    effective_to: string | null;
  }): RateStatusType => {
    const to = r.effective_to ? r.effective_to.slice(0, 10) : null;
    if (to === null || to >= todayStr) return RateStatus.ACTIVE;
    return RateStatus.EXPIRED;
  };

  const activeRates: Record<
    string,
    { amount: string; effectiveFrom: string } | null
  > = {};

  rates.forEach((r) => {
    const status = getRateStatus(r);
    if (status === RateStatus.ACTIVE && !activeRates[r.name]) {
      activeRates[r.name] = {
        amount: r.amount,
        effectiveFrom: r.effective_from,
      };
    }
  });

  const allDueTypeNames = Object.keys(activeRates);

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleRateSubmit = async (data: DueTypeRateInput) => {
    setFormErrors({});
    try {
      await createRate(data);
      setShowRateForm(false);
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 422) {
        try {
          const errorData = await err.response.json();
          setFormErrors(errorData.errors || {});
        } catch (parseErr) {
          console.error("Failed to parse 422 error", parseErr);
        }
      }
    }
  };

  const handleDeleteRate = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus tarif ini?")) return;
    await deleteRate(id);
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-start">
          <h3 className="text-base font-semibold text-gray-900">Tarif Iuran</h3>
          <p className="text-sm text-gray-500">
            Perubahan tarif langsung berlaku saat disimpan dan otomatis menutup
            tarif sebelumnya.
          </p>
        </div>
        {!showRateForm && (
          <button
            id="btn-set-rate"
            onClick={() => {
              setFormErrors({});
              setShowRateForm(true);
            }}
            className="rtis-btn"
          >
            Set Tarif Baru
          </button>
        )}
      </div>

      {/* Active rate cards — one per distinct due type */}
      <div className="flex flex-wrap gap-4">
        {allDueTypeNames.map((name) => {
          const active = activeRates[name];
          return (
            <div
              key={name}
              className="flex-1 shrink-0 basis-[calc(25%-1rem)] min-w-50 rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Iuran {name}
              </p>
              {active ? (
                <>
                  <p className="mt-0.5 text-xl font-bold text-gray-900">
                    {formatRp(active.amount)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Berlaku sejak {active.effectiveFrom.slice(0, 10)}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Aktif
                  </span>
                </>
              ) : (
                <p className="mt-1 text-sm italic text-gray-400">
                  Belum ada tarif aktif
                </p>
              )}
            </div>
          );
        })}
        {allDueTypeNames.length === 0 && (
          <p className="w-full text-sm italic text-gray-400">
            Belum ada tarif. Klik "Set Tarif Baru" untuk mulai.
          </p>
        )}
      </div>

      {showRateForm && (
        <DueTypeRateForm
          rates={rates}
          errors={formErrors}
          loading={loading}
          onSubmit={handleRateSubmit}
          onCancel={() => {
            setFormErrors({});
            setShowRateForm(false);
          }}
        />
      )}

      <DueTypeRateHistory
        rates={rates}
        getRateStatus={getRateStatus}
        onDeleteRate={handleDeleteRate}
      />
    </section>
  );
};
