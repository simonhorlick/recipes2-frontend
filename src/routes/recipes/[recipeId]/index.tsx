import { DocumentHead } from "@builder.io/qwik-city";
import { Resource, component$, useResource$ } from "@builder.io/qwik";

interface RecipeData {
  data: {
    oneRecipe: {
      id: string;
      data: {
        name: string;
        description: string;
        ingredientGroup: Array<{
          ingredients: Array<{ ingredient: string }>;
        }>;
        instructions: Array<{
          instruction: string;
        }>;
      };
    };
  };
}

export const GET_RECIPE_QUERY = `query GetRecipe {
  oneRecipe(query: {id: "8bfd397055d34749abcc8a944e2909db"}) {
    id
    data {
      name
      description
      ingredientGroup
      instructions
    }
  }
}`;

export default component$(() => {
  const recipeData = useResource$<RecipeData>(async ({ track, cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());

    const url = new URL(
      `https://cdn.builder.io/api/v1/graphql/ec31c5156fa0412aa49dd7eb67dcee5f`
    );
    url.searchParams.append("query", GET_RECIPE_QUERY);

    console.log("FETCH", url.toString());

    const response = await fetch(url, {
      signal: controller?.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("FETCH resolved");
    return await response.json();
  });

  return (
    <Resource
      value={recipeData}
      // FIXME: Enable this after https://github.com/BuilderIO/qwik/issues/1526
      // onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Error</div>}
      onResolved={(result) => {
        const recipe = result.data.oneRecipe.data;
        return (
          <>
            <header>
              <h1>{recipe.name}</h1>
              <p class="description">{recipe.description}</p>
            </header>
            <div class="ingredients-box">
              <div class="ingredients-list">
                <h2>INGREDIENTS</h2>

                {recipe.ingredientGroup.map((ig) => (
                  <ul>
                    {ig.ingredients.map((i) => (
                      <li>{i.ingredient}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div class="instructions-box">
              <div class="instructions">
                <h2>Instructions</h2>

                {recipe.instructions.map((i) => (
                  <p>{i.instruction}</p>
                ))}
              </div>
            </div>
          </>
        );
      }}
    />
  );
});

export const head: DocumentHead = {
  title: "Recipe",
};
