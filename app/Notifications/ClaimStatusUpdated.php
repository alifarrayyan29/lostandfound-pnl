<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ClaimStatusUpdated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $claim;
    protected $status;

    public function __construct($claim, $status)
    {
        $this->claim = $claim;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusText = $this->status === 'approved' ? 'disetujui' : 'ditolak';
        $message = "Klaim Anda untuk barang '{$this->claim->itemReport->title}' telah {$statusText}.";
        if ($this->status === 'rejected' && !empty($this->claim->rejection_reason)) {
            $message .= " Alasan: {$this->claim->rejection_reason}";
        }
        
        return [
            'title' => 'Status Klaim Diperbarui',
            'message' => $message,
            'claim_id' => $this->claim->id,
            'status' => $this->status,
            'rejection_reason' => $this->claim->rejection_reason ?? null,
        ];
    }
}
