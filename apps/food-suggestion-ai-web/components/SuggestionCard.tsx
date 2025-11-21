import type { FoodSuggestion } from "@/types";
import styles from "./SuggestionCard.module.css";

interface SuggestionCardProps {
  suggestion: FoodSuggestion;
  index: number;
}

export default function SuggestionCard({
  suggestion,
  index,
}: SuggestionCardProps) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={styles.header}>
        <h3 className={styles.name}>{suggestion.name}</h3>
        <span className={styles.badge}>#{index + 1}</span>
      </div>

      <p className={styles.description}>{suggestion.description}</p>

      <div className={styles.ingredients}>
        <h4>Ingredients:</h4>
        <div className={styles.ingredientList}>
          {suggestion.ingredients.map((ingredient, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: temporary fix
            <span key={i} className={styles.ingredient}>
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.reasoning}>
        <h4>Why this suggestion?</h4>
        <p>{suggestion.reasoning}</p>
      </div>
    </div>
  );
}
