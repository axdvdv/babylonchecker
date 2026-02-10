import { type ProjectModule } from "../types";
import { PlaceholderCard } from "./PlaceholderCard";

export const placeholderProject: ProjectModule = {
  meta: {
    id: "your-project",
    name: "Your Project",
    description: "Have a protocol with unclaimed funds? We can add it here.",
    incident: "Contact us to list your recovery project on Unclaimed Finance.",
    chain: "Any EVM",
    chainId: 0,
    asset: "Any ERC-20",
  },
  Card: PlaceholderCard,
};
