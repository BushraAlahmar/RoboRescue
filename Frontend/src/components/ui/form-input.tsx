import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
    icon,
    type,
    placeholder,
    value,
    onChange,
    required,
    className,
    ...props
}) => {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 outline-none focused shadow-[0_0_8px_rgba(255,255,255,0.08)]   focus:shadow-metallic-accent/50 transition-colors ${
                    className || ""
                }`}
                {...props}
            />
        </div>
    );
};
export default FormInput;
