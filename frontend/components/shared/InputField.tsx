interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField = ({ label, ...props }: InputProps) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">
      {label}
    </label>
    <input 
      {...props} 
      className="bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl p-4 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all" 
    />
  </div>
);