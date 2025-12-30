import React from "react";
import VerificationCard from "./VerificationCard";

const Verification: React.FC = () => {
  return (
    <div>
      <div className="mt-5 font-semibold text-lg">
        Verify securely, Increase Limits
      </div>
      <p className="text-sm text-gray-700 mt-1">
        All tasks on Scan2Pay Direct use Zk verification, keeping your data private
        forever while increasing your limits.
      </p>
      <VerificationCard />
    </div>
  );
};

export default Verification;
