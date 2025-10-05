<template>
  <UForm
    :schema="validationSchema"
    :state="state"
    class="space-y-6 overflow-y-auto px-4 py-10"
    @submit="onSubmit"
  >
    <h1 class="text-3xl font-semibold text-zinc-200">Your Details</h1>
    <UFormField label="Current weight" name="currentWeight" size="xl">
      <UInput v-model="state.currentWeight" type="number" class="w-full">
        <template #trailing>
          <p class="text-muted text-sm">kg</p>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Goal weight" name="goalWeight" size="xl">
      <UInput v-model="state.goalWeight" type="number" class="w-full">
        <template #trailing>
          <p class="text-muted text-sm">kg</p>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Height" name="height" size="xl">
      <UInput v-model="state.height" type="number" class="w-full">
        <template #trailing>
          <p class="text-muted text-sm">cm</p>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Age" name="age" size="xl">
      <UInput v-model="state.age" type="number" class="w-full" />
    </UFormField>

    <UFormField label="Gender" name="gender">
      <URadioGroup
        v-model="state.gender"
        color="primary"
        variant="table"
        :items="genderOptions"
      />
    </UFormField>

    <UFormField label="Activity level" name="activityLevel">
      <URadioGroup
        v-model="state.activityLevel"
        color="primary"
        variant="table"
        :items="activityOptions"
      />
    </UFormField>

    <UButton type="submit" class="mt-8" block size="xl"> Submit </UButton>
  </UForm>
</template>

<script setup>
import { reactive } from "vue";
import { z } from "zod";
import { useUserDataStore } from "~/stores/userData";

const router = useRouter();
const userDataStore = useUserDataStore();

// --- Form Options ---
const genderOptions = ["Male", "Female"];
const activityOptions = [
  {
    label: "Sedentary",
    value: "sedentary",
    description: "Little or no exercise",
  },
  {
    label: "Lightly Active",
    value: "lightly_active",
    description: "Light: 1–3 workouts per week",
  },
  {
    label: "Moderately Active",
    value: "moderately_active",
    description: "Moderate: 3–5 workouts per week",
  },
  {
    label: "Very Active",
    value: "very_active",
    description: "Active: 6–7 workouts per week",
  },
  {
    label: "Extra Active",
    value: "extra_active",
    description: "Daily intense exercise or physical job",
  },
];

// --- Validation Schema (Zod) ---
const validationSchema = z
  .object({
    currentWeight: z.coerce
      .number({ invalid_type_error: "Please enter a valid weight." })
      .min(1, "Please enter a valid weight."),
    goalWeight: z.coerce
      .number({ invalid_type_error: "Please enter a valid weight." })
      .min(1, "Please enter a valid weight."),
    height: z.coerce
      .number({ invalid_type_error: "Please enter a valid height." })
      .min(1, "Please enter a valid height."),
    age: z.coerce
      .number({ invalid_type_error: "Please enter a valid age." })
      .min(1, "Please enter a valid age."),
    gender: z.enum(genderOptions, {
      required_error: "Please select your gender.",
    }),
    activityLevel: z.enum(
      activityOptions.map((opt) => opt.value),
      { required_error: "Please select your activity level." },
    ),
  })
  .refine(
    (data) => {
      if (data.currentWeight && data.goalWeight) {
        return Math.abs(data.goalWeight - data.currentWeight) <= 5;
      }
      return true;
    },
    {
      message: "Goal weight must be within 5 kg of your current weight.",
      path: ["goalWeight"],
    },
  );

// --- Form State ---
// Create a reactive object to hold form data, initialized from the Pinia store.
const state = reactive({
  currentWeight: userDataStore.currentWeight ?? undefined,
  goalWeight: userDataStore.goalWeight ?? undefined,
  height: userDataStore.height ?? undefined,
  age: userDataStore.age ?? undefined,
  gender: userDataStore.gender,
  activityLevel: userDataStore.activityLevel,
});

// --- Submit Handler ---
async function onSubmit(event) {
  // event.data contains the validated and typed form values
  userDataStore.updateDetails(event.data);
  router.push("/");
}
</script>
