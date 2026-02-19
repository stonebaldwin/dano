const EXPERIENCE_ENDPOINT = "https://proapi.experience.com/results";

const REVIEWS_QUERY = `
  query ExperienceReviews($slug: String, $offset: Int, $limit: Int) {
    reviews(slug: $slug, offset: $offset, limit: $limit) {
      reviews {
        uuid
        review
        rating
        reviewer_first_name
        reviewer_last_name
        city
        state
      }
    }
  }
`;

export type ExperienceReview = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  rating: number;
};

type ExperienceGraphResponse = {
  data?: {
    reviews?: {
      reviews?: Array<{
        uuid?: string | null;
        review?: string | null;
        rating?: number | null;
        reviewer_first_name?: string | null;
        reviewer_last_name?: string | null;
        city?: string | null;
        state?: string | null;
      }>;
    };
  };
  errors?: Array<{ message?: string }>;
};

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export async function getExperienceReviews(slug: string, limit = 10): Promise<ExperienceReview[]> {
  try {
    const response = await fetch(EXPERIENCE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: REVIEWS_QUERY,
        variables: {
          slug,
          offset: 0,
          limit
        }
      }),
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ExperienceGraphResponse;
    const reviews = payload.data?.reviews?.reviews ?? [];

    return reviews
      .map((item, index) => {
        const quote = normalizeText(item.review ?? "");
        if (!quote) {
          return null;
        }

        const firstName = normalizeText(item.reviewer_first_name ?? "");
        const lastName = normalizeText(item.reviewer_last_name ?? "");
        const name = normalizeText(`${firstName} ${lastName}`) || "Verified Client";
        const location = [item.city, item.state].filter(Boolean).join(", ");

        return {
          id: item.uuid ?? `${slug}-${index}`,
          quote,
          name,
          detail: location || "Experience.com Review",
          rating: Math.max(1, Math.min(5, Math.round(item.rating ?? 5)))
        };
      })
      .filter((item): item is ExperienceReview => item !== null);
  } catch {
    return [];
  }
}
