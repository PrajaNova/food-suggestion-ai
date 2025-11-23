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
  // Generate a deterministic gradient based on the name length/char codes
  const getGradient = (name: string) => {
    const colors = [
      "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
      <div 
        className={styles.cardHeaderVisual} 
        style={{ background: getGradient(suggestion.name) }}
      >
        <div className={styles.badge}>Suggestion #{index + 1}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{suggestion.name}</h3>
        </div>

        <p className={styles.description}>{suggestion.description}</p>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.icon}>🥘</span> Ingredients
          </h4>
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
          <h4 className={styles.sectionTitle}>
            <span className={styles.icon}>💡</span> Why this?
          </h4>
          <p className={styles.reasoningText}>{suggestion.reasoning}</p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton}>
            Save Recipe
          </button>
          <button type="button" className={`${styles.actionButton} ${styles.primaryAction}`}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
