const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#D9D1BF] bg-[#FBF8EF] px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#0F4A12]";

const errorClassName = "mt-2 text-xs font-medium text-[#A13A2C]";

const DeliveryAddressFields = ({
  address,
  errors = {},
  onChange,
  disabled = false,
  showAddressType = true,
  className = "",
}) => {
  const renderError = (fieldName) =>
    errors[fieldName] ? <p className={errorClassName}>{errors[fieldName]}</p> : null;

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`.trim()}>
      {showAddressType ? (
        <label className="block">
          <span className="text-sm font-medium text-[#353126]">Address type</span>
          <select
            value={address.addressType || "home"}
            onChange={(event) => onChange("addressType", event.target.value)}
            disabled={disabled}
            className={inputClassName}
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          {renderError("addressType")}
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Recipient name</span>
        <input
          type="text"
          value={address.fullName || ""}
          onChange={(event) => onChange("fullName", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("fullName")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Phone</span>
        <input
          type="tel"
          value={address.phone || ""}
          onChange={(event) => onChange("phone", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("phone")}
      </label>

      <label className="block md:col-span-2">
        <span className="text-sm font-medium text-[#353126]">Address line 1</span>
        <input
          type="text"
          value={address.line1 || ""}
          onChange={(event) => onChange("line1", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("line1")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Address line 2</span>
        <input
          type="text"
          value={address.line2 || ""}
          onChange={(event) => onChange("line2", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("line2")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Landmark</span>
        <input
          type="text"
          value={address.landmark || ""}
          onChange={(event) => onChange("landmark", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("landmark")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">City</span>
        <input
          type="text"
          value={address.city || ""}
          onChange={(event) => onChange("city", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("city")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">State</span>
        <input
          type="text"
          value={address.state || ""}
          onChange={(event) => onChange("state", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("state")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Postal code</span>
        <input
          type="text"
          value={address.postalCode || ""}
          onChange={(event) => onChange("postalCode", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("postalCode")}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#353126]">Country</span>
        <input
          type="text"
          value={address.country || ""}
          onChange={(event) => onChange("country", event.target.value)}
          disabled={disabled}
          className={inputClassName}
        />
        {renderError("country")}
      </label>
    </div>
  );
};

export default DeliveryAddressFields;
