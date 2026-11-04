"use client";

/* Shared floating-label input for the admin login and client account screens. */
export type FieldProps = {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onKey?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  describedBy?: string;
};

/** Input with a floating label: the label sits inside the field and moves up on focus or when filled. */
export default function Field({ id, label, type, autoComplete, value, onChange, icon, trailing, invalid, inputRef, onKey, required = true, inputMode, describedBy }: FieldProps) {
  return (
    <div
      className={`group relative flex h-[58px] items-center rounded-xl border bg-white/[.03] pl-3.5 pr-2 transition focus-within:bg-white/[.05] focus-within:shadow-[0_0_0_4px_rgba(34,211,238,.12)] ${
        invalid ? "border-rose-400/50 focus-within:border-rose-400" : "border-white/10 hover:border-white/20 focus-within:border-cyan-400"
      }`}
    >
      <span className="flex-none text-slate-500 transition group-focus-within:text-cyan-300">{icon}</span>
      <div className="relative ml-3 h-full flex-1">
        <input
          ref={inputRef}
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          onKeyUp={onKey}
          placeholder=" "
          required={required}
          inputMode={inputMode}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className="adm-input peer h-full w-full bg-transparent pt-4 text-[15px] text-white outline-none"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[15px] text-slate-500 transition-all duration-200 peer-focus:top-[15px] peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-cyan-300 peer-[:not(:placeholder-shown)]:top-[15px] peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold"
        >
          {label}
        </label>
      </div>
      {trailing}
    </div>
  );
}
