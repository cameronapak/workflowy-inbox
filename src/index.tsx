import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { v4 as uuidv4 } from 'uuid';
import fetch from "cross-fetch";

type Values = {
  new_bullet_title: string;
  new_bullet_note: string;
  api_key: string;
  save_location_url: string;
}

async function submitToWorkflowy(values: Values) {
  const response = await fetch("https://beta.workflowy.com/api/bullets/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${values.api_key}`,
    },
    body: JSON.stringify({
      new_bullet_id: uuidv4(),
      new_bullet_title: values.new_bullet_title,
      new_bullet_note: values.new_bullet_note,
      save_location_url: values.save_location_url,
    }),
  })

  const data = await response.json();
  if (!data) {
    throw new Error("Could not submit form");
  }
}

async function validateWfApiKey(apiKey: string) {
  const response = await fetch("https://beta.workflowy.com/api/me/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  })
  const data = await response.json();
  if (!data) {
    throw new Error("Invalid API Key");
  }
}

export default function Command() {
  
  async function handleSubmit(values: Values) {
    try {
      await validateWfApiKey(values.api_key);
      await submitToWorkflowy(values);
      showToast({ title: "Success!", message: "Added the bullet to your Workflowy inbox." });
    } catch(error: any) {
      showToast({ title: "Error", message: error?.message || error || "Could not submit form" });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action.OpenInBrowser title="Get Workflowy API Key" url="https://workflowy.com/api-key/" />
        </ActionPanel>
      }
    >
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="new_bullet_title" title="Bullet Text" placeholder="What would you like to remember?" defaultValue="bullet text"/>
      <Form.TextArea id="new_bullet_note" title="Bullet Note / Comment" placeholder="Any comments?" defaultValue="bullet note"/>
      <Form.Separator />
      <Form.TextField id="api_key" title="Workflowy API Key" placeholder="Enter text" defaultValue="d074886ab601e58770161fa9e4f3b68d2df255fa"/>
      <Form.Description text="Get your Workflowy API key at https://workflowy.com/api-key/" />
      <Form.TextField id="save_location_url" title="Inbox Bullet Internal Link" placeholder="https://workflowy.com/#/1234..." defaultValue="https://workflowy.com/#/3476e12b23fc" />
      <Form.Description text="Identify the bullet you want to be your inbox bullet and copy the internal link" />
    </Form>
  );
}
