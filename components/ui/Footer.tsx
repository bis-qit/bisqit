import React from "react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-8 shadow-sm" style={{ backgroundColor: "#A37CF0" }}>
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p className="text-sm text-center text-black max-w-3xl">
          The BisQit is a user friendly Quantum Circuit Simulator that can be used as a tool for 
          performing calculations related to Quantum Information Theory as well as an tutor in 
          learning the abstract concepts of it through visualisation of the output states and 
          probabilities. Would you like to improve BisQit ? PRs are {" "}
          <a 
            href="https://github.com/bis-qit/bisqit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-black underline"
          >
            welcome
          </a>
        </p>
      </div>
    </footer>
  );
}